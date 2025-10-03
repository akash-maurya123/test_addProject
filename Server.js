// // Import required modules
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://akashmaurya8877_db_user:McQSwzj4N3Vc9PGE@projectadd.u33jp13.mongodb.net/?retryWrites=true&w=majority&appName=projectadd', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Define Project schema
// const projectSchema = new mongoose.Schema({
//   image: String, // Could be image URL or base64 string
//   title: { type: String, required: true },
//   description: String,
//   technology: [String], // Array of technologies
// });

// // Create Project model
// const Project = mongoose.model('Project', projectSchema);

// // Initialize Express app
// const app = express();
// app.use(bodyParser.json());

// // CRUD routes

// // Create new project
// app.post('/api/projects', async (req, res) => {
//   try {
//     const project = new Project(req.body);
//     const savedProject = await project.save();
//     res.status(201).json(savedProject);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get all projects
// app.get('/api/projects', async (req, res) => {
//   try {
//     const projects = await Project.find();
//     res.json(projects);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get project by id
// app.get('/api/projects/:id', async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });
//     res.json(project);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update project by id
// app.put('/api/projects/:id', async (req, res) => {
//   try {
//     const updatedProject = await Project.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedProject)
//       return res.status(404).json({ message: 'Project not found' });
//     res.json(updatedProject);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete project by id
// app.delete('/api/projects/:id', async (req, res) => {
//   try {
//     const deletedProject = await Project.findByIdAndDelete(req.params.id);
//     if (!deletedProject)
//       return res.status(404).json({ message: 'Project not found' });
//     res.json({ message: 'Project deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Start server
// const PORT = 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


/// username - akashmaurya8877_db_user
/// password - McQSwzj4N3Vc9PGE

//  mongodb+srv://akashmaurya8877_db_user:McQSwzj4N3Vc9PGE@projectadd.u33jp13.mongodb.net/
// mongodb+srv://akashmaurya8877_db_user:<db_password>@projectadd.u33jp13.mongodb.net/?retryWrites=true&w=majority&appName=projectadd



// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Enable CORS (allow frontend to access backend)
app.use(cors({
  origin: "*", // allow all origins (for production you can restrict to your frontend URL)
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Connect to MongoDB using .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Define Project schema
const projectSchema = new mongoose.Schema({
  image: String, 
  title: { type: String, required: true },
  description: String,
  technology: [String],
});

// Create Project model
const Project = mongoose.model('Project', projectSchema);

// CRUD routes

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project by id
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project by id
app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProject)
      return res.status(404).json({ message: 'Project not found' });
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project by id
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject)
      return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
