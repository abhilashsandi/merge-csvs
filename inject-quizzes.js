const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'system-design', 'components');

const modulesData = {
  'Module1.tsx': {
    title: 'Architecture & Scalability',
    questions: [
      {
        id: '1',
        text: 'What is the primary difference between Software Design and Software Architecture?',
        options: [
          'Design is strategic (long-term decisions), Architecture is tactical (short-term implementation).',
          'Architecture focuses on high-level structures and attributes (scalability, availability), while Design focuses on module-level implementation and code structure.',
          'They are synonymous terms for the exact same process.',
          'Architecture only applies to backend systems, while Design applies to front-end UIs.'
        ],
        correctAnswer: 1,
        explanation: 'Architecture deals with the macro-level system structure, deployment, and quality attributes (scalability, availability). Design is tactical, dealing with how specific components and algorithms are implemented.'
      },
      {
        id: '2',
        text: 'In Hexagonal Architecture (Ports & Adapters), what is the primary purpose of a Port?',
        options: [
          'To connect the application to the internet via TCP/IP.',
          'To define an interface that the core domain requires to communicate with the outside world, without depending on a specific implementation.',
          'To act as a reverse proxy for load balancing incoming HTTP requests.',
          'To directly execute SQL queries against the database.'
        ],
        correctAnswer: 1,
        explanation: 'Ports are simply interfaces defined by the core domain. They dictate *what* the domain needs (e.g., IUserRepository) without caring *how* it is implemented. Adapters then implement these ports.'
      },
      {
        id: '3',
        text: 'Which architectural strategy is best suited for scaling a stateless web server that is experiencing high CPU load?',
        options: [
          'Vertical Scaling (scaling up the server RAM).',
          'Database Sharding (partitioning the data).',
          'Horizontal Scaling (adding more server instances behind a load balancer).',
          'Implementing the Singleton Pattern.'
        ],
        correctAnswer: 2,
        explanation: 'For stateless components under heavy CPU load, Horizontal Scaling (scaling out) is the most effective and resilient strategy, allowing a load balancer to distribute traffic across many smaller nodes.'
      }
    ]
  },
  'Module2.tsx': {
    title: 'Microservices & DDD',
    questions: [
      {
        id: '1',
        text: 'According to Domain-Driven Design (DDD), what is a Bounded Context?',
        options: [
          'A strict limit on the amount of CPU and Memory a microservice can consume.',
          'A linguistic and semantic boundary within which a specific domain model is defined and strictly applies.',
          'The physical network boundary that separates public subnets from private subnets.',
          'A database transaction that ensures ACID properties.'
        ],
        correctAnswer: 1,
        explanation: 'A Bounded Context defines the boundary within which a specific ubiquitous language and model applies. For example, a "User" means something different in a Billing context vs a Support context.'
      },
      {
        id: '2',
        text: 'What is the main advantage of the Strangler Fig pattern for legacy migration?',
        options: [
          'It forces a complete rewrite of the system from scratch in one go.',
          'It instantly deletes the legacy database to force adoption of the new system.',
          'It allows incremental, low-risk replacement of legacy functionality by routing specific traffic to new microservices over time.',
          'It automatically converts monolithic code into Docker containers.'
        ],
        correctAnswer: 2,
        explanation: 'The Strangler Fig pattern allows teams to incrementally migrate pieces of a monolith to new services, using a proxy to route traffic. This minimizes risk compared to a "big bang" rewrite.'
      },
      {
        id: '3',
        text: 'Why is "Integration via a Shared Database" generally considered an anti-pattern in microservices architectures?',
        options: [
          'Because relational databases cannot hold more than a few gigabytes of data.',
          'It violates the principle of independent deployability and creates tight coupling between services.',
          'It is strictly forbidden by Docker and Kubernetes.',
          'It makes the application too fast, causing race conditions.'
        ],
        correctAnswer: 1,
        explanation: 'Microservices should own their own data. Sharing a database creates tight coupling; if one team changes the schema, it breaks the other services relying on it, destroying independent deployability.'
      }
    ]
  },
  'Module3.tsx': {
    title: 'Practical Distributed Systems',
    questions: [
      {
        id: '1',
        text: 'According to the CAP Theorem, if a distributed system experiences a network Partition (P), what trade-off must it make?',
        options: [
          'It must choose between Consistency (C) and Availability (A).',
          'It must choose between Concurrency (C) and Asynchrony (A).',
          'It must shut down immediately to prevent data corruption.',
          'It can magically guarantee both Consistency and Availability.'
        ],
        correctAnswer: 0,
        explanation: 'The CAP theorem states that during a network Partition (which is inevitable in distributed systems), a system must choose between being Available (but potentially returning stale data) or Consistent (returning an error instead of stale data).'
      },
      {
        id: '2',
        text: 'What is the primary purpose of the Circuit Breaker pattern?',
        options: [
          'To permanently block IP addresses of malicious users.',
          'To gracefully handle and prevent cascading failures when a downstream service is struggling or unresponsive.',
          'To shut off power to the data center during an electrical surge.',
          'To route traffic to the fastest available database replica.'
        ],
        correctAnswer: 1,
        explanation: 'A Circuit Breaker detects when a downstream service is failing. It "trips" (opens) to immediately fail fast instead of waiting for timeouts, giving the struggling service time to recover and preventing upstream services from also failing.'
      },
      {
        id: '3',
        text: 'In the Saga pattern, how does "Choreography" differ from "Orchestration"?',
        options: [
          'Choreography uses a central controller, while Orchestration uses events.',
          'Choreography relies on services publishing and reacting to events independently, while Orchestration relies on a central controller coordinating the transactions.',
          'Choreography is only used for monoliths, Orchestration is for microservices.',
          'They are exactly the same thing.'
        ],
        correctAnswer: 1,
        explanation: 'Choreography is decentralized (services react to each other\'s events like dancers). Orchestration is centralized (a central Orchestrator service tells each service exactly what to do, like a conductor).'
      }
    ]
  },
  'Module4.tsx': {
    title: 'Real-World Outages & Edge Cases',
    questions: [
      {
        id: '1',
        text: 'In collaborative editing systems like Google Docs, what is the primary advantage of CRDTs over Operational Transformation (OT)?',
        options: [
          'CRDTs require a central server to arbitrate and order all operations.',
          'CRDTs are mathematically designed to commute, meaning operations can be applied in any order without a central server, ensuring eventual consistency.',
          'CRDTs consume zero memory.',
          'CRDTs only support plain text, while OT supports images.'
        ],
        correctAnswer: 1,
        explanation: 'CRDTs (Conflict-free Replicated Data Types) use mathematical properties (commutativity) to resolve conflicts natively, allowing true decentralized peer-to-peer collaboration without a central OT server.'
      },
      {
        id: '2',
        text: 'What was the root cause that initiated the catastrophic 2021 Facebook global outage?',
        options: [
          'A massive DDoS attack by state-sponsored hackers.',
          'A buggy maintenance command that accidentally severed the connections between Facebook\'s data centers, causing DNS withdrawal.',
          'A power outage at their primary Virginia data center.',
          'An expired SSL certificate on the main domain.'
        ],
        correctAnswer: 1,
        explanation: 'A routine capacity assessment command contained a bug that took down all backbone connections. This caused the DNS servers to withdraw BGP routes, erasing Facebook from the internet and locking engineers out of their own network.'
      },
      {
        id: '3',
        text: 'What is a "Cascading Failure"?',
        options: [
          'When a CSS stylesheet fails to load properly.',
          'When the failure of one component increases the load on other components, causing them to overload and fail sequentially in a domino effect.',
          'When a database transaction is rolled back.',
          'A specific AWS feature for scaling down instances.'
        ],
        correctAnswer: 1,
        explanation: 'A cascading failure occurs when a small failure (like one node crashing) shifts its traffic to remaining nodes, which then become overloaded and crash, eventually taking down the entire system.'
      }
    ]
  },
  'Module5.tsx': {
    title: 'AWS Cloud Primitives',
    questions: [
      {
        id: '1',
        text: 'Which AWS database service is a fully managed NoSQL database designed for consistent single-digit millisecond latency at any scale?',
        options: [
          'Amazon RDS (Relational Database Service)',
          'Amazon Redshift',
          'Amazon DynamoDB',
          'Amazon S3'
        ],
        correctAnswer: 2,
        explanation: 'DynamoDB is a fully managed, serverless, key-value NoSQL database designed to run high-performance applications at any scale with consistent single-digit millisecond latency.'
      },
      {
        id: '2',
        text: 'What is the main difference between an Application Load Balancer (ALB) and a Network Load Balancer (NLB)?',
        options: [
          'ALB is faster than NLB.',
          'ALB operates at Layer 7 (HTTP/HTTPS) and can route based on URLs/headers, while NLB operates at Layer 4 (TCP/UDP) for ultra-low latency.',
          'ALB is only for on-premise servers, NLB is for cloud servers.',
          'There is no difference; they are aliases for the same service.'
        ],
        correctAnswer: 1,
        explanation: 'ALB is a Layer 7 proxy capable of inspecting HTTP headers and paths for intelligent routing. NLB operates at Layer 4, handling millions of requests per second at ultra-low latency using TCP/UDP.'
      },
      {
        id: '3',
        text: 'In AWS VPC networking, what is the key difference between a Security Group and a Network ACL (NACL)?',
        options: [
          'Security Groups act at the subnet level, NACLs act at the instance level.',
          'Security Groups are stateless, NACLs are stateful.',
          'Security Groups are stateful and tied to instances/ENIs, while NACLs are stateless and tied to entire subnets.',
          'Security Groups only allow Outbound traffic, NACLs only allow Inbound traffic.'
        ],
        correctAnswer: 2,
        explanation: 'Security Groups are stateful (if you allow an inbound port, outbound response is automatically allowed) and applied to instances. NACLs are stateless (rules must be defined for both inbound and outbound) and applied to entire subnets as a perimeter defense.'
      }
    ]
  }
};

Object.keys(modulesData).forEach(filename => {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('<Quiz')) {
    console.log("Skipping " + filename + " - Quiz already injected.");
    return;
  }

  content = content.replace(/(import React.*?;\n)/, "$1import Quiz from './Quiz';\n");
  
  const questionsJson = JSON.stringify(modulesData[filename].questions, null, 2);
  const questionsCode = "\nconst moduleQuestions = " + questionsJson + ";\n\n";
  
  content = content.replace(/(export default function)/, questionsCode + "$1");

  const insertIndex = content.lastIndexOf('</div>');
  if (insertIndex !== -1) {
    const title = modulesData[filename].title;
    const quizTag = "\n\n      {/* Module Quiz */}\n      <Quiz title=\"" + title + "\" questions={moduleQuestions} />\n    ";
    content = content.slice(0, insertIndex) + quizTag + content.slice(insertIndex);
    
    fs.writeFileSync(filePath, content);
    console.log("Injected Quiz into " + filename);
  }
});
