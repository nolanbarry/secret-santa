import { DynamoDB } from "@aws-sdk/client-dynamodb";
import constants from "../utils/constants";

const ddb = new DynamoDB({region: constants.region})

