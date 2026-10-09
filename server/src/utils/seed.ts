import { User } from '../models/user.model';
import { Profile } from '../models/profile.model';
import { Skill } from '../models/skill.model';
import { Project } from '../models/project.model';
import { Experience } from '../models/experience.model';
import { Education } from '../models/education.model';
import { Service } from '../models/service.model';
import { Blog } from '../models/blog.model';
import { ContactMessage } from '../models/contact.model';

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminExists = await User.findOne({ email: 'admin@portfolio.dev' });
    if (!adminExists) {
      await User.create({
        name: 'Alex Rivera',
        email: 'admin@portfolio.dev',
        password: 'AdminPass123!',
        role: 'admin',
      });
      console.log('[Seed] Admin user created (admin@portfolio.dev / AdminPass123!)');
    }

    // 2. Seed Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create({
        name: 'Alex Rivera',
        title: 'Senior Full-Stack Engineer & Cloud Architect',
        bio: 'Passionate software craftsman with 7+ years of experience architecting distributed cloud systems, high-performance web applications, and intuitive developer tooling. Obsessed with clean code, developer experience, and sub-second performance.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        resumeUrl: 'https://example.com/resume.pdf',
        location: 'San Francisco, CA / Remote',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 234-5678',
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          website: 'https://alexrivera.dev',
          instagram: 'https://instagram.com',
          youtube: 'https://youtube.com',
        },
      });
      console.log('[Seed] Profile created');
    }

    // 3. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const skills = [
        // Frontend
        { name: 'React.js', category: 'Frontend', proficiency: 98, icon: 'code', order: 1 },
        { name: 'TypeScript', category: 'Frontend', proficiency: 96, icon: 'terminal', order: 2 },
        { name: 'Next.js', category: 'Frontend', proficiency: 92, icon: 'layers', order: 3 },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, icon: 'palette', order: 4 },
        { name: 'Vue.js', category: 'Frontend', proficiency: 85, icon: 'code', order: 5 },
        // Backend
        { name: 'Node.js', category: 'Backend', proficiency: 96, icon: 'server', order: 6 },
        { name: 'Express.js', category: 'Backend', proficiency: 95, icon: 'server', order: 7 },
        { name: 'NestJS', category: 'Backend', proficiency: 88, icon: 'server', order: 8 },
        { name: 'GraphQL / REST', category: 'Backend', proficiency: 92, icon: 'link', order: 9 },
        { name: 'Python / FastAPI', category: 'Backend', proficiency: 86, icon: 'terminal', order: 10 },
        // Database
        { name: 'MongoDB & Mongoose', category: 'Database', proficiency: 94, icon: 'database', order: 11 },
        { name: 'PostgreSQL', category: 'Database', proficiency: 90, icon: 'database', order: 12 },
        { name: 'Redis Caching', category: 'Database', proficiency: 88, icon: 'database', order: 13 },
        // DevOps & Cloud
        { name: 'Docker & Containers', category: 'DevOps & Cloud', proficiency: 92, icon: 'box', order: 14 },
        { name: 'Kubernetes', category: 'DevOps & Cloud', proficiency: 82, icon: 'cloud', order: 15 },
        { name: 'AWS (ECS, S3, Lambda)', category: 'DevOps & Cloud', proficiency: 90, icon: 'cloud', order: 16 },
        { name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps & Cloud', proficiency: 93, icon: 'git-branch', order: 17 },
        // Tools
        { name: 'Git & Version Control', category: 'Tools', proficiency: 98, icon: 'git-commit', order: 18 },
        { name: 'Swagger / OpenAPI', category: 'Tools', proficiency: 95, icon: 'book', order: 19 },
        { name: 'Jest & Unit Testing', category: 'Tools', proficiency: 90, icon: 'check-circle', order: 20 },
      ];
      await Skill.insertMany(skills);
      console.log(`[Seed] ${skills.length} skills inserted`);
    }

    // 4. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const projects = [
        {
          title: 'NexusCloud Orchestrator',
          description: 'Autonomous multi-cloud Kubernetes orchestration and real-time observability platform. Provides single-pane-of-glass cluster telemetry, automated autoscaling, and zero-downtime rollouts.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          technologies: ['React', 'TypeScript', 'Node.js', 'Go', 'Docker', 'Kubernetes', 'Tailwind CSS'],
          githubUrl: 'https://github.com/example/nexus-cloud',
          liveUrl: 'https://nexuscloud.example.dev',
          featured: true,
          order: 1,
        },
        {
          title: 'DevFlow AI Workflow Studio',
          description: 'Generative AI-driven developer productivity workspace that performs contextual code reviews, automated unit test generation, and pull request summarization with custom LLM embeddings.',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          technologies: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'Redis', 'Tailwind CSS'],
          githubUrl: 'https://github.com/example/devflow-ai',
          liveUrl: 'https://devflow.example.dev',
          featured: true,
          order: 2,
        },
        {
          title: 'FinPulse Settlement Gateway',
          description: 'High-throughput financial ledger and payment orchestrator processing over 10,000 TPS with zero ledger discrepancy, distributed idempotency locks, and PCI-DSS compliant tokenization.',
          image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
          technologies: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker'],
          githubUrl: 'https://github.com/example/finpulse-gateway',
          liveUrl: 'https://finpulse.example.dev',
          featured: true,
          order: 3,
        },
        {
          title: 'QuantumPulse Stream Space',
          description: 'Real-time collaborative canvas with ultra-low latency WebRTC audio/video feeds, bi-directional WebSocket delta synchronization, and interactive infinite whiteboards.',
          image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
          technologies: ['React', 'WebRTC', 'Socket.io', 'Node.js', 'Tailwind CSS'],
          githubUrl: 'https://github.com/example/quantumpulse',
          liveUrl: 'https://quantumpulse.example.dev',
          featured: false,
          order: 4,
        },
        {
          title: 'CyberShield Cloud SIEM',
          description: 'Next-generation cloud security and anomaly detection system monitoring suspicious API access, AWS CloudTrail anomalies, and privileged IAM escalations with immediate alert triage.',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
          technologies: ['TypeScript', 'Express', 'Elasticsearch', 'AWS', 'Tailwind CSS'],
          githubUrl: 'https://github.com/example/cybershield',
          liveUrl: 'https://cybershield.example.dev',
          featured: false,
          order: 5,
        },
        {
          title: 'OmniStore Headless Commerce',
          description: 'Supercharged headless eCommerce platform featuring sub-50ms page transitions, edge-cached product catalogs, Stripe checkout integration, and comprehensive admin inventory analytics.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          technologies: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'Stripe API'],
          githubUrl: 'https://github.com/example/omnistore',
          liveUrl: 'https://omnistore.example.dev',
          featured: false,
          order: 6,
        },
      ];
      await Project.insertMany(projects);
      console.log(`[Seed] ${projects.length} projects inserted`);
    }

    // 5. Seed Experience
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      const experiences = [
        {
          company: 'CloudScale Technologies',
          position: 'Staff Full-Stack Engineer',
          description: 'Spearheaded the redesign of core cloud management platform serving 500k+ monthly active developers. Reduced average API latency by 45% using Redis caching and connection multiplexing.',
          startDate: '2023',
          endDate: 'Present',
          location: 'San Francisco, CA (Hybrid)',
          technologies: ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'Kubernetes'],
          order: 1,
        },
        {
          company: 'TechVanguard Solutions',
          position: 'Senior Software Engineer',
          description: 'Architected microservices-based transaction processing engine handling $25M+ in monthly transaction volume. Mentored 8 junior and mid-level engineers and established TypeScript coding standards.',
          startDate: '2021',
          endDate: '2023',
          location: 'San Francisco, CA',
          technologies: ['TypeScript', 'Express', 'MongoDB', 'PostgreSQL', 'Jest', 'CI/CD'],
          order: 2,
        },
        {
          company: 'NextGen Digital Labs',
          position: 'Full-Stack Developer',
          description: 'Built high-converting single page applications, enterprise customer dashboards, and internal workflow management tools. Implemented automated end-to-end testing and CI/CD pipelines.',
          startDate: '2019',
          endDate: '2021',
          location: 'San Jose, CA',
          technologies: ['React', 'Node.js', 'Redux', 'MongoDB', 'CSS3', 'Git'],
          order: 3,
        },
      ];
      await Experience.insertMany(experiences);
      console.log(`[Seed] ${experiences.length} experience records inserted`);
    }

    // 6. Seed Education
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      const education = [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science (B.S.)',
          field: 'Computer Science & Software Engineering',
          startDate: '2015',
          endDate: '2019',
          description: 'Graduated with Magna Cum Laude honors. Relevant coursework: Advanced Distributed Systems, Database Management Systems, Algorithm Design, Machine Learning.',
        },
        {
          institution: 'Amazon Web Services (AWS)',
          degree: 'Solutions Architect Professional (SAP-C02)',
          field: 'Cloud Infrastructure & High Availability',
          startDate: '2022',
          endDate: '2025',
          description: 'Comprehensive certification demonstrating deep proficiency in designing distributed fault-tolerant cloud architectures on AWS.',
        },
        {
          institution: 'Cloud Native Computing Foundation',
          degree: 'Certified Kubernetes Application Developer (CKAD)',
          field: 'Container Orchestration & Cloud Native Systems',
          startDate: '2021',
          endDate: '2024',
          description: 'Hands-on qualification proving skill in architecting, running, and debugging containerized workloads inside production Kubernetes clusters.',
        },
      ];
      await Education.insertMany(education);
      console.log(`[Seed] ${education.length} education records inserted`);
    }

    // 7. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const services = [
        {
          title: 'Full-Stack Web Development',
          description: 'Architecting robust, scalable web applications from scratch using modern TypeScript, React, and Node.js with exceptional performance and clean design.',
          icon: 'code',
        },
        {
          title: 'Cloud Architecture & DevOps',
          description: 'Designing resilient cloud infrastructure, automating CI/CD release cycles, Docker containerization, and cost-effective serverless deployment pipelines.',
          icon: 'cloud',
        },
        {
          title: 'High-Performance REST & GraphQL APIs',
          description: 'Building secure, well-documented, ultra-fast RESTful and GraphQL APIs with OpenAPI specifications, role-based JWT auth, and database tuning.',
          icon: 'server',
        },
        {
          title: 'Database Architecture & Optimization',
          description: 'Schema modeling, indexing strategies, caching implementations with Redis, and migration pipelines for both MongoDB and relational databases.',
          icon: 'database',
        },
        {
          title: 'Code Auditing & Technical Consulting',
          description: 'Deep-dive code reviews, performance bottleneck profiling, security vulnerability assessments, and technical strategy consulting for growth-stage startups.',
          icon: 'search',
        },
        {
          title: 'UI/UX & Modern Frontend Engineering',
          description: 'Translating design mockups into pixel-perfect, accessible, mobile-first responsive web interfaces with smooth micro-interactions and dark mode.',
          icon: 'layout',
        },
      ];
      await Service.insertMany(services);
      console.log(`[Seed] ${services.length} services inserted`);
    }

    // 8. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const blogs = [
        {
          title: 'Architecting Resilient Microservices with Node.js and TypeScript',
          slug: 'architecting-resilient-microservices-with-nodejs-and-typescript',
          excerpt: 'A practical deep dive into building fault-tolerant backend architectures, circuit breakers, and distributed tracing in production environments.',
          content: `In distributed software engineering, resilience is not an afterthought—it is a foundational requirement. When building microservices with Node.js and TypeScript, handling network partitions, timeouts, and downstream dependency failures requires structured patterns.

### 1. The Circuit Breaker Pattern
Instead of continuously hammering an unresponsive downstream service, circuit breakers track consecutive failures and trip into an open state. This gives troubled dependencies time to recover while gracefully degrading user experience.

### 2. Strict Type Safety Across Boundaries
Utilizing TypeScript interfaces and runtime schema validators (like Zod or Joi) ensures that contract breaks between distributed nodes are caught at the perimeter before contaminating internal business logic.

### 3. Graceful Shutdown & Health Probes
Always ensure SIGTERM and SIGINT listeners are wired to stop accepting new HTTP requests, drain active sockets, and terminate database connections cleanly before exiting the container process.`,
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
          tags: ['Node.js', 'TypeScript', 'Microservices', 'Architecture'],
          published: true,
        },
        {
          title: 'Mastering Full-Stack Performance: From MongoDB Indexing to React Rendering',
          slug: 'mastering-full-stack-performance',
          excerpt: 'Proven strategies for cutting end-to-end response times down to sub-100ms across the entire stack.',
          content: `Achieving exceptional web application performance requires holistic attention across both ends of the wire. Here are the core pillars that produce measurable speed gains.

### Compound Indexes in MongoDB
Without appropriate compound indexes, querying sorted data with filter conditions forces full collection scans. Index keys in Equality, Sort, Range (ESR) order to guarantee index-covered executions.

### Leveraging HTTP Caching & Edge Layers
Use Cache-Control headers with stale-while-revalidate for read-heavy public APIs. Combine with Cloudflare or CloudFront edge nodes to reduce origin server load by over 80%.

### React Re-render Hygiene
Prevent unnecessary component re-renders using memoized hooks and component isolation. Keep component state as localized as possible to avoid broad component subtree invalidations.`,
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
          tags: ['React', 'MongoDB', 'Performance', 'Full-Stack'],
          published: true,
        },
        {
          title: 'Building Enterprise OpenAPI Specifications with Swagger and Express',
          slug: 'building-enterprise-openapi-specifications',
          excerpt: 'Why interactive Swagger documentation accelerates frontend-backend collaboration and streamlines client generation.',
          content: `API documentation should never be stale or written as an afterthought in markdown documents that get lost in company wikis. Living OpenAPI specs ensure alignment and empower developers.

### Live Testing with Bearer Authentication
Embedding Bearer JWT authorization directly in Swagger UI allows team members and external developers to test authenticated endpoints without opening third-party HTTP clients.

### Automated Type Synchronization
A well-defined OpenAPI specification can be fed into code generators to emit strongly typed TypeScript SDKs for frontend applications, ensuring 100% type synchronicity at build time.`,
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
          tags: ['Swagger', 'Express', 'API Design', 'OpenAPI'],
          published: true,
        },
      ];
      await Blog.insertMany(blogs);
      console.log(`[Seed] ${blogs.length} blog posts inserted`);
    }

    // 9. Seed Contact Message
    const contactCount = await ContactMessage.countDocuments();
    if (contactCount === 0) {
      await ContactMessage.create({
        name: 'Elena Rostova',
        email: 'elena.rostova@techventures.io',
        subject: 'Exciting Senior Staff Architect role at TechVentures',
        message: 'Hello Alex, I came across your portfolio and was thoroughly impressed by your open source work and architecture articles. We would love to talk about leading our new cloud platform team.',
        status: 'unread',
      });
      console.log('[Seed] Initial contact message seeded');
    }

    console.log('[Seed] Database initialization and seed check complete!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};
