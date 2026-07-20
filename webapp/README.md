# AWS CloudFormation Diagrams Web App

A modern web application for generating AWS architecture diagrams from CloudFormation templates using [AWS CloudFormation Diagrams](https://github.com/philippemerle/AWS-CloudFormation-Diagrams).

## Features

- **CloudFormation Template Input**: Paste, upload, or load a built-in example (YAML or JSON)
- **Flexible Output Formats**: Generate diagrams in PNG, JPEG, GIF, SVG, PDF, DOT, interactive HTML (dot_json), draw.io, Mermaid, and D2
- **Live Rendering**: Mermaid and D2 diagrams are rendered client-side; DOT is rendered server-side to SVG
- **Interactive Viewer**: Explore dot_json diagrams with an interactive web viewer (zoom, pan, filter by resource type)
- **Monaco Editor**: Full-featured code editor (syntax highlighting, line numbers) for template input
- **Built-in Examples**: Pre-loaded CloudFormation templates for quick testing
- **History Management**: Keep track of your diagram generations, with restore support
- **Icon Embedding**: Optional `--embed-all-icons` flag to embed all icons into the output
- **Docker Support**: Easy deployment with Docker and Docker Compose
- **Access Logging**: Apache Combined Log format compatible with GoAccess

---

## Quick Start

### Using Docker Compose (Recommended)

#### 1. **Clone the repository**

```bash
git clone https://github.com/philippemerle/AWS-CloudFormation-Diagrams.git
cd AWS-CloudFormation-Diagrams/webapp
```

#### 2. **Start the application**

```bash
docker compose up -d
```

#### 3. **Access the application**

Open your browser and navigate to `http://localhost:8080`.

That's it! The application is now running with both frontend and backend services.

#### Stopping the application

```bash
docker compose down
```

---

## Prerequisites

### Server-Side Tools (Required) (Included in requirements.txt)

The following command-line tool must be installed and available in your PATH:

- **`aws-cfn-diagrams`** - For generating diagrams from AWS CloudFormation templates ([Installation](https://github.com/philippemerle/AWS-CloudFormation-Diagrams))
- **`graphviz`** (`dot`) - Required for DOT-to-SVG rendering

### Docker Deployment
- Docker Engine 20.10+
- Docker Compose

### Manual Deployment
- **Backend**: Python 3.9+, pip, venv
- **Frontend**: Node.js 18+, npm

---

## Project Structure

```
webapp/
├── backend/                        # Python/Flask backend
│   ├── routes/                     # Flask route handlers
│   │   ├── cfn.py                  # CFN diagram generation endpoint
│   │   ├── render.py               # On-demand DOT-to-SVG rendering endpoint
│   │   └── submit.py               # Feedback submission endpoint
│   ├── services/                   # Business logic layer
│   │   ├── cfnService.py           # aws-cfn-diagrams processing service
│   │   ├── file_manager.py         # File operations manager
│   │   ├── models.py               # Data models
│   │   └── utils.py                # extraArgs parsing, DOT-to-SVG, path redaction
│   ├── utils/                      # Utility modules
│   │   ├── access_logger.py        # Request logging
│   │   ├── logger.py               # General logging
│   │   ├── response_builder.py     # API response builder
│   │   └── validators.py           # Input validation, extraArgs allowlist
│   ├── app.py                      # Flask application entry point
│   ├── config.py                   # Configuration settings
│   ├── constants.py                # Global constants (formats, MIME types)
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend Docker image
│   └── logs/                       # Log files (auto-rotation)
│
├── frontend/                       # React/Vite frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── common/             # Reusable UI components (DiagramViewer, YamlEditor, HistoryPanel, ...)
│   │   │   ├── options/            # Diagram configuration components
│   │   │   └── tabs/
│   │   │       └── CfnTab/         # CloudFormation template tab
│   │   ├── examples/               # Example registry
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API client services
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx                 # Main application component
│   │   └── main.jsx                # Application entry point
│   ├── public/
│   │   ├── examples/cfn/           # Example CloudFormation templates
│   │   └── interactive_viewer/     # Interactive viewer assets
│   ├── package.json                # NPM dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── apache.conf                 # Apache reverse proxy config
│   └── Dockerfile                  # Frontend Docker image
│
└── docker-compose.yml              # Docker Compose orchestration
```

---

## Manual Installation (Without Docker)

### Backend Setup

#### 1. **Navigate to backend directory**

```bash
cd backend
```

#### 2. **Create and activate virtual environment**

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 3. **Install dependencies**

```bash
pip install -r requirements.txt
```

#### 4. **Start the Flask server**

```bash
python3 app.py
```

The backend server will be available at `http://localhost:5000`.

### Frontend Setup

#### 1. **Navigate to frontend directory**

```bash
cd frontend
```

#### 2. **Install dependencies**

```bash
npm install
```

or

```bash
npm ci
```

#### 3. **Start the development server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Docker Deployment

### Architecture

The Docker Compose setup consists of two services:
- **Frontend**: Apache2 server serving React static files and acting as reverse proxy to the backend
- **Backend**: Python/Flask application with Gunicorn WSGI server running `aws-cfn-diagrams`

### Configuration

#### Environment Variables

**Backend** (`backend/Dockerfile` or `docker-compose.yml`):
- `FLASK_DEBUG`: Set to `true` to enable Flask debug mode (default: `false`)
- `BEHIND_PROXY`: Set to `true` when running behind a reverse proxy (default: `true`)
- `PROXY_X_FOR`: Number of trusted proxies (default: `1`)

**Frontend** (`docker-compose.yml`):
- `BACKEND_URL`: Backend service URL (default: `http://backend:5000`)

#### Ports

- **Frontend**: Port `8080` (mapped to container port `80`)
- **Backend**: Port `5000` (internal only, accessed via frontend proxy)

### Building and Running

#### **Build and start services**

```bash
docker compose up --build
```

#### **Start in detached mode**

```bash
docker compose up -d
```

#### **View logs**

```bash
docker compose logs -f
```

#### **Stop services**

```bash
docker compose down
```

### Health Checks

The backend includes a health check endpoint at `/api/health` that Docker uses to monitor service health.

---

## Logging

The Flask backend generates detailed access logs in **Apache Combined Log format**, compatible with tools like **GoAccess** for analysis.

### Log Location

- **Docker**: `./backend/logs/access.log` (persisted via volume mount)
- **Manual**: `backend/logs/access.log`

### Log Format

```
IP - - [datetime] "METHOD PATH PROTOCOL" STATUS SIZE "REFERER" "USER-AGENT" TIME_MS
```

### Log Rotation

- **Frequency**: Daily at midnight
- **Retention**: 30 days
- **Format**: `access.log.YYYY-MM-DD`

### IP Address Detection

When running behind a reverse proxy (Apache, Nginx), the backend correctly identifies client IPs using `X-Forwarded-For` headers.

**Debug endpoint** (only enabled when `FLASK_DEBUG=true`): `GET /api/debug/ip` - Returns IP detection information

---

## Usage Guide

### CloudFormation Template Tab

Generate diagrams from AWS CloudFormation templates.

**Steps**:
1. Paste your CloudFormation template (YAML or JSON) in the Monaco editor, upload a file, or load a built-in example
2. Configure diagram options (output format, CLI arguments, embed all icons)
3. Click "Generate"
4. Download the generated diagram or view it interactively

**Supported Resources**: Any resource type supported by [AWS CloudFormation Diagrams](https://github.com/philippemerle/AWS-CloudFormation-Diagrams).

### Interactive Viewer

For the `dot_json` output format, diagrams open in an interactive HTML viewer with zoom, pan, and resource-type filtering (dropdown filters by AWS domain/service/type).

### DOT, Mermaid and D2 Formats

- **DOT**: Rendered server-side to SVG (via `dot -Tsvg`) and displayed as a pannable/zoomable diagram
- **Mermaid**: Rendered client-side (via mermaid.js) as a live diagram
- **D2**: Rendered client-side (via the D2 WASM runtime) as a live diagram

---

## Configuration Options

### Diagram Options

- **Format**: PNG, JPEG, GIF, SVG, PDF, DOT, DOT_JSON (interactive), draw.io, Mermaid, D2
- **CLI Arguments**: Optional custom parameters passed to `aws-cfn-diagrams` (restricted to an allowlist of safe flags)
- **Embed All Icons**: Option to embed all icons into the output (`--embed-all-icons`)
- **Feedback System**: Rate diagrams and provide comments for improvement

### Available via CLI Arguments

The CLI arguments field allows you to pass additional parameters to customize diagram generation. Only flags not already managed by the application are allowed; refer to [AWS CloudFormation Diagrams documentation](https://github.com/philippemerle/AWS-CloudFormation-Diagrams#usage) for available options.

---

## Examples

The web application includes built-in CloudFormation template examples for quick testing:

- **WordPress with RDS**: WordPress application with an Amazon RDS database
- **ElastiCache Redis**: Amazon ElastiCache with the Redis engine
- **IAM Policy**: AWS IAM Policy resource

### Adding Custom Examples

See `frontend/public/examples/README.md` for instructions on adding new examples.

---

## API Endpoints

### Backend API

- `GET /api/health` - Health check
- `POST /api/generate-cfn-diagram` - Generate a diagram from a CloudFormation template
- `POST /api/render-dot-svg` - Render DOT source (from a previous generation) to SVG
- `POST /api/submit-feedback` - Submit feedback
- `GET /api/debug/ip` - IP detection information (only enabled when `FLASK_DEBUG=true`)

### POST /api/generate-cfn-diagram

**Request:**
```json
{
  "template": "<CloudFormation template content, YAML or JSON>",
  "outputFormat": "png",
  "extraArgs": "",
  "embedAllIcons": false
}
```

**Response (success):**
```json
{
  "success": true,
  "diagram": "<base64 or text content depending on the format>",
  "mimeType": "image/png",
  "filename": "tmpXXX.png",
  "message": "Diagram successfully generated.",
  "command": "aws-cfn-diagrams tmpXXX.yaml -f png -o tmpXXX",
  "stdout": "...",
  "stderr": ""
}
```

**Supported formats:** `png`, `jpg`, `jpeg`, `gif`, `svg`, `pdf`, `dot`, `dot_json`, `drawio`, `mermaid`, `d2`

---

## Troubleshooting

### Common Issues

**Issue**: "Command not found: aws-cfn-diagrams"
- **Solution**: Ensure AWS CloudFormation Diagrams is installed and in your PATH

**Issue**: DOT diagrams fail to render
- **Solution**: Verify `graphviz` (the `dot` executable) is installed and in the backend's PATH

**Issue**: Frontend cannot connect to backend
- **Solution**: Check that the backend is running and CORS is properly configured

**Issue**: IP addresses showing as proxy IP instead of client IP
- **Solution**: Verify `BEHIND_PROXY=true` and `PROXY_X_FOR` is set correctly

### Debug Mode

Enable debug mode by setting the `FLASK_DEBUG` environment variable to `true` for more detailed error messages and the `/api/debug/ip` endpoint. Never enable this in a publicly accessible deployment.

---

## Testing

### Quick Test

1. Start both backend and frontend servers
2. Navigate to `http://localhost:8080` (Docker) or `http://localhost:5173` (manual)
3. Load an example (e.g., "WordPress with RDS")
4. Click "Generate"
5. Verify the diagram is generated and can be downloaded

---

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend Development

```bash
cd backend
source venv/bin/activate
python3 app.py       # Start Flask server
```

### Technologies Used

**Backend**:
- Flask 3.1.2 - Web framework
- Gunicorn 23.0.0 - WSGI server
- AWS CloudFormation Diagrams (main) - Diagram generation
- PyYAML 6.0.3 - YAML parsing
- Werkzeug 3.1.3 - WSGI utilities

**Frontend**:
- React 19.1.0 - UI framework
- Vite 6.3.5 - Build tool
- TailwindCSS 4.1.6 - Styling
- Monaco Editor 0.54.0 - Code editor
- Mermaid 11.16.0 - Mermaid diagram rendering
- @terrastruct/d2 0.1.33 - D2 diagram rendering
- Lucide React 0.552.0 - Icons
- Motion 12.11.4 - Animations

---

## Contributing

Contributions are welcome! Please feel free to [submit a Pull Request](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/pulls).

---

## Support

For issues and questions, please [open an issue on the GitHub repository](https://github.com/philippemerle/AWS-CloudFormation-Diagrams/issues).

---

## Acknowledgments
- [Graphviz](https://graphviz.org/) - Graph visualization software
- [KubeDiagrams](https://github.com/philippemerle/KubeDiagrams) - This web app's architecture was adapted from the KubeDiagrams web app
