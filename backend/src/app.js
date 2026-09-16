// Load environment variables from the root .env file
import dotenv from 'dotenv';
// Core Express framework for handling HTTP routing and middleware pipelines
import express from 'express';
// CORS middleware to manage cross-origin resource sharing from the frontend client
import cors from 'cors';
// Import endpoints of the routes JSON file.
import { plantRouter } from './routes/plant.routes.js';

// Initialize environment configuration immediately on process launch
dotenv.config();

/**
 * Encapsulates Express setup, middleware lifecycle, and graceful server startup.
 */
class ApplicationServer {
  /**
   * Initializes server properties and orchestrates setup stages.
   */
  constructor() {
    // Validate the environment before instantiating or assigning any variable.
    this.validateEnvironment();

    // If the validation is correct, continue with the inicialization.
    // Instantiate the Express application
    this.app = express();
    // Resolve port from environment variables or fall back to default 3000
    this.port = process.env.PORT || 3000;

    // Execute sequential setup pipeline
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  /**
   * Registers global pre-routing middlewares.
   */
  setupMiddlewares() {
    // Enable cross-origin resource access according to environment policy
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGIN || '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Parse incoming JSON payloads with a safety threshold
    this.app.use(express.json({ limit: '2mb' }));

    // Parse URL-encoded form submissions
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Registers foundational system routes and health probes.
   */
  setupRoutes() {
    // Standard liveness probe endpoint (GET).
    this.app.get('/api/v1/health', (request, response) => {
      response.status(200).json({
        status: 'UP',
        service: 'botany-pokedex-bff',
        uptimeInSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      });
    });

    // Endpoint (GET) for showing system info.
    this.app.get('/api/v1/system/info', (request, response) => {
        response.status(200).json({
            nodeVersion: process.version,
            platform: process.platform,
            memoryRssMb: Math.round((process.memoryUsage().rss / (1024 * 1024)) * 100) / 100,
            uptimeSeconds: Math.floor(process.uptime())
        });
    });

    // Endpoint (POST) for sending image to the AI.
    this.app.use('/api/v1/plants', plantRouter);
  }

  /**
   * Registers terminal fallback middleware for central error delegation.
   */
  setupErrorHandlers() {
    // Terminal 4-argument Express error handling signature
    this.app.use((error, request, response, next) => {
      console.error('[Application Error]:', error);

      const httpStatusCode = error.statusCode || 500;

      response.status(httpStatusCode).json({
        success: false,
        error: {
          message: error.message || 'Internal server error.',
          status: httpStatusCode
        }
      });
    });
  }

  /**
   * Starts listening for incoming TCP traffic on the configured port.
   */
  start() {
    this.app.listen(this.port, () => {
      console.log(`[Server] Active and listening on: http://localhost:${this.port}`);
      console.log(`[Server] Active environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }

  // Method for validating the environment variables of the class.
  validateEnvironment(){
    const requiredVariables = ['PORT', 'ALLOWED_ORIGIN', 'GEMINI_API_KEY'];

    // Filter and collect names of variables that fail validation
    const missingVariables = requiredVariables.filter((variableName) => {
        const value = process.env[variableName];
        return !isEnvironmentVariableValid(value);
    })

    // Abort execution immediately if any required variable is absent
    if (missingVariables.length > 0){
        throw new Error(`[Config Error] Missing required environment variables: ${missingVariables.join(', ')}`);
    }
  }
}

// Instantiate server instance
const applicationServer = new ApplicationServer();

// Boot up the HTTP listener
applicationServer.start();

// Export application for integration testing or modular mounting
export default applicationServer.app;

// Checks if the given value is a defined string with non-whitespace content
function isEnvironmentVariableValid(value){
    return typeof value === 'string' && value.trim() !== ''; // trim(): remove whitespaces (only used with strings).
}