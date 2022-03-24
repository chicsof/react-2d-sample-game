const AWS = require("aws-sdk");
// update HERE
AWS.config.update({ region: "eu-west-1" });
const docClient = new AWS.DynamoDB.DocumentClient();

// update HERE
const TABLE_NAME = "pockemonDB";

const headers = {
  "Access-Control-Allow-Headers": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
};

const getItems = async (userId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
    },
  };
  const data = await docClient.get(params).promise();
  return data;
};

exports.handler = async (event) => {
  try {
    // ID Token Payload
    // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html
    const userId = event?.requestContext?.authorizer?.claims?.sub;
    const {
      Item: { data },
    } = await getItems(userId);
    if (data) {
      return { headers, statusCode: 200, body: JSON.stringify(data) };
    } else {
      throw new Error("data not the right format");
    }
  } catch (err) {
    console.error(err);
    return { headers, statusCode: 503, body: "error fetching from db" };
  }
};
