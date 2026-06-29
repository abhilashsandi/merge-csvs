const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'system-design', 'components');
const files = ['Module1.tsx', 'Module2.tsx', 'Module3.tsx', 'Module4.tsx', 'Module5.tsx'];

// The new imports
const importCodeBlock = `import CodeBlock from './CodeBlock';\n`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add CodeBlock import if missing
  if (!content.includes('import CodeBlock')) {
    content = content.replace(/(import React.*?;\n)/, `$1${importCodeBlock}`);
  }

  // 2. Remove inline CodeBlock in Module3.tsx
  if (file === 'Module3.tsx') {
    content = content.replace(/const CodeBlock = \(\{(?:.|\n)*?<\/div>\s*\)\s*;\s*\n/m, '');
  }

  // Module 1 injections
  if (file === 'Module1.tsx' && !content.includes('interface UserRepository')) {
    const hexRegex = /(<Card className="border-purple-500\/30">[\s\S]*?<\/Card>\s*<\/div>)/;
    const hexCode = `
      <div className="mt-8">
        <h5 className="text-white font-bold mb-2">TypeScript Hexagonal Example</h5>
        <CodeBlock language="typescript" code={\`// 1. Core Domain (No Dependencies)
export class User {
  constructor(public id: string, public email: string) {}
}

// 2. Port (Interface defined by Domain)
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}

// 3. Adapter (Implementation relying on DB, lives outside Domain)
import { Client } from 'pg';
export class PostgresUserRepository implements UserRepository {
  constructor(private db: Client) {}
  
  async save(user: User) {
    await this.db.query('INSERT INTO users (id, email) VALUES ($1, $2)', [user.id, user.email]);
  }
  // ...
}\`} />
      </div>`;
    content = content.replace(hexRegex, `$1\n${hexCode}`);

    const serverlessRegex = /(<h4 className="text-lg font-semibold text-white mb-4">Serverless Characteristics<\/h4>[\s\S]*?<\/ul>\n\s*<\/Card>)/;
    const serverlessCode = `
      <div className="mt-8">
        <h5 className="text-white font-bold mb-2">AWS Lambda Node.js Example</h5>
        <CodeBlock language="typescript" code={\`import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Stateless function triggered by an event
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const result = await processOrder(body); // Business logic

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', data: result })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};\`} />
      </div>`;
    content = content.replace(serverlessRegex, `$1\n${serverlessCode}`);
  }

  // Module 2 injections
  if (file === 'Module2.tsx' && !content.includes('namespace BillingContext')) {
    const dddRegex = /(<li><strong className="text-white">Anti-corruption Layer:<\/strong> Translates between models to prevent legacy concepts from polluting the new model\.<\/li>\n\s*<\/ul>\n\s*<\/Card>)/;
    const dddCode = `
      <div className="mt-8">
        <h5 className="text-white font-bold mb-2">Bounded Contexts in TypeScript</h5>
        <CodeBlock language="typescript" code={\`// Different contexts have completely different models for the "same" entity.

namespace UserContext {
  // To the Identity team, a User is credentials and roles
  export interface User {
    userId: string;
    passwordHash: string;
    mfaEnabled: boolean;
    role: 'ADMIN' | 'CUSTOMER';
  }
}

namespace BillingContext {
  // To the Billing team, a User is a payment profile
  export interface User {
    userId: string;
    stripeCustomerId: string;
    activeSubscription: string;
    outstandingBalance: number;
  }
}\`} />
      </div>`;
    content = content.replace(dddRegex, `$1\n${dddCode}`);
  }

  // Module 4 injections
  if (file === 'Module4.tsx' && !content.includes('class LWWRegister')) {
    const crdtRegex = /(<td className="p-3 border-b border-slate-700 text-slate-300">Eventually consistent, offline friendly<\/td>\n\s*<\/tr>\n\s*<\/tbody>\n\s*<\/table>\n\s*<\/div>)/;
    const crdtCode = `
      <div className="mt-8">
        <h5 className="text-white font-bold mb-2">CRDT Last-Write-Wins (LWW) Register in TypeScript</h5>
        <CodeBlock language="typescript" code={\`// A simple CRDT where timestamps resolve conflicts automatically
class LWWRegister<T> {
  private value: T;
  private timestamp: number;

  constructor(initialValue: T, initialTimestamp: number = 0) {
    this.value = initialValue;
    this.timestamp = initialTimestamp;
  }

  get(): T {
    return this.value;
  }

  // Local update
  set(newValue: T) {
    this.value = newValue;
    this.timestamp = Date.now();
  }

  // Merge state from a remote node
  merge(remoteValue: T, remoteTimestamp: number) {
    if (remoteTimestamp > this.timestamp) {
      this.value = remoteValue;
      this.timestamp = remoteTimestamp;
    }
    // If timestamps are exactly equal, you'd fallback to node ID comparison
  }
}\`} />
      </div>`;
    content = content.replace(crdtRegex, `$1\n${crdtCode}`);
  }

  // Module 5 injections
  if (file === 'Module5.tsx' && !content.includes('const dynamoDb = new DynamoDBClient')) {
    const dynamoRegex = /(<span className="text-sm">Consistent single-digit millisecond latency at any scale\.<\/span>\n\s*<\/li>\n\s*<\/ul>\n\s*<\/div>)/;
    const dynamoCode = `
      <div className="mt-8">
        <h5 className="text-white font-bold mb-2">DynamoDB Query using AWS SDK v3</h5>
        <CodeBlock language="javascript" code={\`import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Single Table Design query pattern
export async function getUserOrders(userId) {
  const command = new QueryCommand({
    TableName: "ECommerceTable",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues: {
      ":pk": \`USER#\${userId}\`,
      ":skPrefix": "ORDER#"
    }
  });

  const response = await ddbDocClient.send(command);
  return response.Items;
}\`} />
      </div>`;
    content = content.replace(dynamoRegex, `$1\n${dynamoCode}`);
  }

  fs.writeFileSync(filePath, content);
}
console.log('Successfully enhanced modules with code blocks.');
