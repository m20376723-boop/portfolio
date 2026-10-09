import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Developer Portfolio REST API',
    version: '1.0.0',
    description:
      'Production-ready backend API documentation for Personal Portfolio with Full-stack features, authentication, and content management.',
    contact: {
      name: 'Developer Support',
      email: 'alex.rivera@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT Bearer token to authorize administrative requests.',
      },
    },
    schemas: {
      StandardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
          data: { type: 'object', nullable: true },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource not found' },
          error: { type: 'string', nullable: true },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f123456789abcdef012345' },
          name: { type: 'string', example: 'Alex Rivera' },
          email: { type: 'string', example: 'alex@example.com' },
          role: { type: 'string', example: 'admin' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Alex Rivera' },
          title: { type: 'string', example: 'Senior Full-Stack Engineer' },
          bio: { type: 'string', example: 'Passionate developer with 7+ years of building web applications.' },
          profileImage: { type: 'string', example: 'https://example.com/avatar.jpg' },
          resumeUrl: { type: 'string', example: 'https://example.com/resume.pdf' },
          location: { type: 'string', example: 'San Francisco, CA' },
          email: { type: 'string', example: 'alex@example.com' },
          phone: { type: 'string', example: '+1 (555) 019-2834' },
          socialLinks: {
            type: 'object',
            properties: {
              github: { type: 'string', example: 'https://github.com' },
              linkedin: { type: 'string', example: 'https://linkedin.com' },
              twitter: { type: 'string', example: 'https://twitter.com' },
              website: { type: 'string', example: 'https://alexrivera.dev' },
            },
          },
        },
      },
      Skill: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'React.js' },
          category: {
            type: 'string',
            enum: ['Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'Mobile & Other', 'Tools'],
            example: 'Frontend',
          },
          proficiency: { type: 'number', minimum: 1, maximum: 100, example: 95 },
          icon: { type: 'string', example: 'react' },
          order: { type: 'number', example: 1 },
        },
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Cloud Scale Analytics Engine' },
          description: { type: 'string', example: 'Real-time telemetry and metrics analytics dashboard.' },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71' },
          technologies: {
            type: 'array',
            items: { type: 'string' },
            example: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          },
          githubUrl: { type: 'string', example: 'https://github.com/example/project' },
          liveUrl: { type: 'string', example: 'https://project.example.com' },
          featured: { type: 'boolean', example: true },
          order: { type: 'number', example: 1 },
        },
      },
      Experience: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          company: { type: 'string', example: 'Stripe' },
          position: { type: 'string', example: 'Staff Full-Stack Engineer' },
          description: { type: 'string', example: 'Architected high-throughput checkout APIs and developer dashboards.' },
          startDate: { type: 'string', example: '2022' },
          endDate: { type: 'string', example: 'Present' },
          location: { type: 'string', example: 'San Francisco, CA' },
          technologies: { type: 'array', items: { type: 'string' }, example: ['Node.js', 'React', 'MongoDB'] },
          order: { type: 'number', example: 1 },
        },
      },
      Education: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          institution: { type: 'string', example: 'University of California, Berkeley' },
          degree: { type: 'string', example: 'B.S.' },
          field: { type: 'string', example: 'Computer Science' },
          startDate: { type: 'string', example: '2016' },
          endDate: { type: 'string', example: '2020' },
          description: { type: 'string', example: 'Dean\'s Honors List, Algorithms and Distributed Systems Focus.' },
        },
      },
      Service: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Full-Stack Web Development' },
          description: { type: 'string', example: 'End-to-end architecture and modern responsive web applications.' },
          icon: { type: 'string', example: 'code' },
        },
      },
      Blog: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Mastering Modern Full-Stack Systems' },
          slug: { type: 'string', example: 'mastering-modern-full-stack-systems' },
          content: { type: 'string', example: 'In-depth architectural patterns for scalable TypeScript backends...' },
          excerpt: { type: 'string', example: 'Key architectural insights for building reliable microservices.' },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' },
          tags: { type: 'array', items: { type: 'string' }, example: ['TypeScript', 'Node.js', 'Architecture'] },
          published: { type: 'boolean', example: true },
        },
      },
      ContactMessage: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Sarah Connor' },
          email: { type: 'string', example: 'sarah@example.com' },
          subject: { type: 'string', example: 'Inquiry regarding freelance project' },
          message: { type: 'string', example: 'Hi Alex, I love your portfolio and would like to collaborate!' },
          status: { type: 'string', enum: ['unread', 'read', 'replied', 'archived'], example: 'unread' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new administrator or user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alex Rivera' },
                  email: { type: 'string', example: 'alex@example.com' },
                  password: { type: 'string', example: 'Admin123!' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registration successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/StandardResponse' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login and receive JWT authentication token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'alex@example.com' },
                  password: { type: 'string', example: 'Admin123!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Logged in successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/StandardResponse' } } } },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get currently authenticated user',
        security: [{ BearerAuth: [] }],
        tags: ['Authentication'],
        responses: {
          200: { description: 'User profile retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/StandardResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/profile': {
      get: {
        summary: 'Get public developer profile details',
        tags: ['Profile'],
        responses: {
          200: { description: 'Profile retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/StandardResponse' } } } },
        },
      },
      put: {
        summary: 'Update developer profile (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Profile'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Profile' },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated successfully' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/api/skills': {
      get: {
        summary: 'List all skills',
        tags: ['Skills'],
        responses: {
          200: { description: 'Skills retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/StandardResponse' } } } },
        },
      },
      post: {
        summary: 'Create a new skill (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Skills'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } },
        },
        responses: {
          201: { description: 'Skill created' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/skills/{id}': {
      get: {
        summary: 'Get single skill by ID',
        tags: ['Skills'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Skill retrieved' }, 404: { description: 'Skill not found' } },
      },
      put: {
        summary: 'Update skill (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Skills'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } } },
        responses: { 200: { description: 'Skill updated' }, 401: { description: 'Unauthorized' } },
      },
      delete: {
        summary: 'Delete skill (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Skills'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Skill deleted' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/api/projects': {
      get: {
        summary: 'List all portfolio projects',
        tags: ['Projects'],
        parameters: [{ in: 'query', name: 'featured', schema: { type: 'boolean' }, description: 'Filter only featured projects' }],
        responses: { 200: { description: 'Projects fetched' } },
      },
      post: {
        summary: 'Create project (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Projects'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
        responses: { 201: { description: 'Project created' } },
      },
    },
    '/api/projects/{id}': {
      get: {
        summary: 'Get project by ID',
        tags: ['Projects'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Project fetched' }, 404: { description: 'Not found' } },
      },
      put: {
        summary: 'Update project (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Projects'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
        responses: { 200: { description: 'Project updated' } },
      },
      delete: {
        summary: 'Delete project (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Projects'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Project deleted' } },
      },
    },
    '/api/experience': {
      get: {
        summary: 'List experience timeline entries',
        tags: ['Experience'],
        responses: { 200: { description: 'Experience records fetched' } },
      },
      post: {
        summary: 'Create experience entry (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Experience'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Experience' } } } },
        responses: { 201: { description: 'Experience record created' } },
      },
    },
    '/api/experience/{id}': {
      get: {
        summary: 'Get experience entry by ID',
        tags: ['Experience'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Record fetched' } },
      },
      put: {
        summary: 'Update experience entry (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Experience'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Experience' } } } },
        responses: { 200: { description: 'Record updated' } },
      },
      delete: {
        summary: 'Delete experience entry (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Experience'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Record deleted' } },
      },
    },
    '/api/education': {
      get: {
        summary: 'List education credentials',
        tags: ['Education'],
        responses: { 200: { description: 'Education records fetched' } },
      },
      post: {
        summary: 'Create education record (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Education'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Education' } } } },
        responses: { 201: { description: 'Education record created' } },
      },
    },
    '/api/education/{id}': {
      get: {
        summary: 'Get education record by ID',
        tags: ['Education'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Record fetched' } },
      },
      put: {
        summary: 'Update education record (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Education'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Education' } } } },
        responses: { 200: { description: 'Record updated' } },
      },
      delete: {
        summary: 'Delete education record (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Education'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Record deleted' } },
      },
    },
    '/api/services': {
      get: {
        summary: 'List offered services',
        tags: ['Services'],
        responses: { 200: { description: 'Services fetched' } },
      },
      post: {
        summary: 'Create new service (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Services'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Service' } } } },
        responses: { 201: { description: 'Service created' } },
      },
    },
    '/api/services/{id}': {
      get: {
        summary: 'Get service by ID',
        tags: ['Services'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Service fetched' } },
      },
      put: {
        summary: 'Update service (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Services'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Service' } } } },
        responses: { 200: { description: 'Service updated' } },
      },
      delete: {
        summary: 'Delete service (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Services'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Service deleted' } },
      },
    },
    '/api/blogs': {
      get: {
        summary: 'List blog posts',
        tags: ['Blogs'],
        parameters: [{ in: 'query', name: 'all', schema: { type: 'boolean' }, description: 'Include unpublished blogs (Admin only)' }],
        responses: { 200: { description: 'Blog posts fetched' } },
      },
      post: {
        summary: 'Create blog post (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Blogs'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Blog' } } } },
        responses: { 201: { description: 'Blog post created' } },
      },
    },
    '/api/blogs/{slug}': {
      get: {
        summary: 'Get single blog post by slug',
        tags: ['Blogs'],
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Blog post fetched' }, 404: { description: 'Not found' } },
      },
    },
    '/api/blogs/id/{id}': {
      get: {
        summary: 'Get blog post by ID',
        tags: ['Blogs'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Blog post fetched' } },
      },
      put: {
        summary: 'Update blog post (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Blogs'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Blog' } } } },
        responses: { 200: { description: 'Blog post updated' } },
      },
      delete: {
        summary: 'Delete blog post (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Blogs'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Blog post deleted' } },
      },
    },
    '/api/contact': {
      post: {
        summary: 'Submit a contact message from portfolio visitors',
        tags: ['Contact'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                  name: { type: 'string', example: 'Alex Visitor' },
                  email: { type: 'string', example: 'visitor@example.com' },
                  subject: { type: 'string', example: 'Collaboration project' },
                  message: { type: 'string', example: 'Hi! Let us collaborate on a high-growth project.' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Message sent successfully' } },
      },
      get: {
        summary: 'List contact inbox messages (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Contact'],
        responses: { 200: { description: 'Contact messages retrieved' } },
      },
    },
    '/api/contact/{id}': {
      get: {
        summary: 'Get single message (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Contact'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Message retrieved' } },
      },
      put: {
        summary: 'Update message status (read, replied, archived) (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Contact'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: { status: { type: 'string', enum: ['unread', 'read', 'replied', 'archived'] } },
              },
            },
          },
        },
        responses: { 200: { description: 'Status updated' } },
      },
      delete: {
        summary: 'Delete contact message (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Contact'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Message deleted' } },
      },
    },
    '/api/upload': {
      post: {
        summary: 'Upload an image or document asset (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Upload'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'File uploaded successfully' } },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Developer Portfolio API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
  console.log('[Swagger] OpenAPI docs available at http://localhost:5000/api-docs');
};
