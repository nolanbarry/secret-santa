import { Attribute, AttributeType, Table } from "aws-cdk-lib/aws-dynamodb"
import { SecretSantaStack } from "./secret-santa-stack"

export type Tables = {
  auth: Table,
  users: Table,
  players: Table,
  games: Table
}

type TableReference = keyof Tables

type TableConfigurationProps = {
  partitionKey: string,
  sortKey?: string,
  ttlKey?: string,
  globalIndexes?: {
    name: string,
    partitionKey: string,
    sortKey?: string
  }[]
}

const tableConfigProps: { [Property in TableReference]: TableConfigurationProps } = {
  games: {
    partitionKey: 'code'
  },
  users: {
    partitionKey: 'id',
    globalIndexes: [
      { name: 'by-phone-number', partitionKey: 'phone-number' },
      { name: 'by-email', partitionKey: 'email' }
    ]
  },
  players: {
    partitionKey: 'game-code',
    sortKey: 'display-name',
  },
  auth: {
    partitionKey: 'id',
    sortKey: 'otp',
    ttlKey: 'expiration-date',
    globalIndexes: [
      { name: 'by-auth-token', partitionKey: 'auth-token' }
    ]
  }
}

class TableSchema {
  name: string
  cdkID: string
  partitionKey: string
  sortKey?: string
  ttlKey?: string
  globalIndexes: {
    name: string
    partitionKey: string,
    sortKey?: string
  }[]

  constructor(name: string, props: TableConfigurationProps) {
    this.name = `secret-santa-${name.toLowerCase()}-table`
    this.cdkID = `${name[0].toUpperCase() + name.slice(1)}Table`
    this.globalIndexes = props.globalIndexes ?? []
    this.partitionKey = props.partitionKey
    this.sortKey = props.sortKey
    this.ttlKey = props.ttlKey
  }
}

/*
 * Maps each defined `TableConfigurationProps` object defined in `tableConfigProps` to a `TableSchema` 
 * object. Using an actual object instead an object literal lets us fill in default values.
 */
function buildConfigurationMap(): { [Property in TableReference]: TableSchema } {
  const configurationMap: any = {}
  for (let reference of Object.keys(tableConfigProps) as TableReference[]) {
    configurationMap[reference] = new TableSchema(reference, tableConfigProps[reference]);
  }
  return configurationMap;
}

export const tableConfigurations = buildConfigurationMap()


/** Creates all the tables as defined in the `Tables` type. */
export function createTables(scope: SecretSantaStack): Tables {
  const tables: { [ref: string]: Table } = {}
  for (const tableReference of Object.keys(tableConfigurations) as TableReference[]) {
    const config = tableConfigurations[tableReference]

    const ttl: { timeToLiveAttribute?: string } = {}
    if (config.ttlKey) ttl.timeToLiveAttribute = config.ttlKey

    const sortKey: { sortKey?: Attribute } = {}
    if (config.sortKey) sortKey.sortKey = { name: config.sortKey, type: AttributeType.STRING }

    // create table
    tables[tableReference] = new Table(scope, config.cdkID, {
      tableName: config.name,
      partitionKey: { name: config.partitionKey, type: AttributeType.STRING },
      ...sortKey,
      ...ttl
    })

    // add indexes
    for (let globalIndex of config.globalIndexes) {
      const sortKey: any = {}
      if (globalIndex.sortKey) sortKey.sortKey = { name: globalIndex.sortKey, type: AttributeType.STRING }
      tables[tableReference].addGlobalSecondaryIndex({
        indexName: globalIndex.name,
        partitionKey: { name: globalIndex.partitionKey, type: AttributeType.STRING },
        ...sortKey,
      })
    }
  }

  return tables as Tables
}