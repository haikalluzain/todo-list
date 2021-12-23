# TODO List (Boilerplate)
 This is a simple boilerplate for Node js. Stacks: Node js, express js, Typescript, MongoDB, etc.

# Requirement (Local environment)
1. Node js version 12 or higher
2. Git Bash
3. Text Editor (Recommended: WebStorm)
4. MongoDB Compass

# Getting Started

### **Set up env**
```bash
cp .env.example .env
```

### **Install**
```bash
yarn install / npm install
```

### **Build**
```bash
yarn build
```

### **Run Development Server**
```bash
yarn dev
```
### **Run Tests**
```bash
yarn test
```

## Project Structure

```
src\
 |--api\            # Controllers, Routes and Middleware
 |--config\         # Environment variables and configuration related things
 |--interfaces\     # Data structure and type
 |--lib\            # Library files that required for the system
 |--models\         # Mongoose models (data layer)
 |--utils\          # Utility classes and functions
 |--app.ts          # Express app
```

## API Endpoints

List of available routes:

### **Auth routes**:
- `POST /api/auth/register` - register\
- `POST /api/auth/login` - login\

### **User routes**:
@TODO

### **Task routes**:
- `GET /api/task` - get all tasks\
- `POST /api/task` - create a task\
- `PUT /api/task/:taskId` - update a task\
- `DELETE /api/task/:taskId` - delete task

## API Documentation
@ TODO

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## License

[MIT](LICENSE)
