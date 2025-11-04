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

// Define Experience schema
const experienceSchema = new mongoose.Schema({
  period: { type: String, required: true }, // e.g., "2024", "2023–2024"
  position: { type: String, required: true }, // e.g., "Software Engineer", "Software Developer"
  company: { type: String, required: true }, // e.g., "Ajeevi Technologies Pvt. Ltd.", "AVSG Tracking Path"
  companyDescription: String, // Company overview
  responsibilities: [String], // Array of responsibilities and achievements
  technologies: [String], // Technologies used in this role
});

// Define Profile schema
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jobRole: { type: String, required: true },
  experience: { type: String, required: true },
  address: { type: String, required: true },
  skills: [
    {
      name: String,
      percentage: Number
    }
  ],
  about: {
    description: String,
    profile: {
      image: String,
      title: String,
      domain: [String],
      education: String,
      languages: [String],
      otherSkills: [String],
      interests: [String],
      projectsCompleted: Number
    }
  }
});

// Create Project model
const Project = mongoose.model('Project', projectSchema);

// Create Experience model
const Experience = mongoose.model('Experience', experienceSchema);

// Create Profile model
const Profile = mongoose.model('Profile', profileSchema);

// CRUD routes for Projects

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

// CRUD routes for Experiences

// Create new experience
app.post('/api/experiences', async (req, res) => {
  try {
    const experience = new Experience(req.body);
    const savedExperience = await experience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ period: -1 }); // Sort by period descending (most recent first)
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get experience by id
app.get('/api/experiences/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update experience by id
app.put('/api/experiences/:id', async (req, res) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExperience)
      return res.status(404).json({ message: 'Experience not found' });
    res.json(updatedExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete experience by id
app.delete('/api/experiences/:id', async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience)
      return res.status(404).json({ message: 'Experience not found' });
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CRUD routes for Profile

// Create new profile (usually only one profile)
app.post('/api/profile', async (req, res) => {
  try {
    const profile = new Profile(req.body);
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get profile (usually only one profile)
app.get('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get profile by id
app.get('/api/profile/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile by id
app.put('/api/profile/:id', async (req, res) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProfile)
      return res.status(404).json({ message: 'Profile not found' });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete profile by id
app.delete('/api/profile/:id', async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile)
      return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// // Import required modules
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config(); // Load environment variables

// // Initialize Express app
// const app = express();
// app.use(bodyParser.json());

// // Enable CORS (allow frontend to access backend)
// app.use(cors({
//   origin: "*", // allow all origins (for production you can restrict to your frontend URL)
//   methods: ["GET", "POST", "PUT", "DELETE"],
// }));

// // Connect to MongoDB using .env
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.error(err));

// // Define Project schema
// const projectSchema = new mongoose.Schema({
//   image: String, 
//   title: { type: String, required: true },
//   description: String,
//   technology: [String],
// });

// // Define Experience schema
// const experienceSchema = new mongoose.Schema({
//   period: { type: String, required: true }, // e.g., "2024", "2023–2024"
//   position: { type: String, required: true }, // e.g., "Software Engineer", "Software Developer"
//   company: { type: String, required: true }, // e.g., "Ajeevi Technologies Pvt. Ltd.", "AVSG Tracking Path"
//   companyDescription: String, // Company overview
//   responsibilities: [String], // Array of responsibilities and achievements
//   technologies: [String], // Technologies used in this role
// });

// // Create Project model
// const Project = mongoose.model('Project', projectSchema);

// // Create Experience model
// const Experience = mongoose.model('Experience', experienceSchema);

// // CRUD routes for Projects

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

// // CRUD routes for Experiences

// // Create new experience
// app.post('/api/experiences', async (req, res) => {
//   try {
//     const experience = new Experience(req.body);
//     const savedExperience = await experience.save();
//     res.status(201).json(savedExperience);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get all experiences
// app.get('/api/experiences', async (req, res) => {
//   try {
//     const experiences = await Experience.find().sort({ period: -1 }); // Sort by period descending (most recent first)
//     res.json(experiences);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get experience by id
// app.get('/api/experiences/:id', async (req, res) => {
//   try {
//     const experience = await Experience.findById(req.params.id);
//     if (!experience) return res.status(404).json({ message: 'Experience not found' });
//     res.json(experience);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update experience by id
// app.put('/api/experiences/:id', async (req, res) => {
//   try {
//     const updatedExperience = await Experience.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedExperience)
//       return res.status(404).json({ message: 'Experience not found' });
//     res.json(updatedExperience);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete experience by id
// app.delete('/api/experiences/:id', async (req, res) => {
//   try {
//     const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
//     if (!deletedExperience)
//       return res.status(404).json({ message: 'Experience not found' });
//     res.json({ message: 'Experience deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


/// username - akashmaurya8877_db_user
/// password - McQSwzj4N3Vc9PGE

//  mongodb+srv://akashmaurya8877_db_user:McQSwzj4N3Vc9PGE@projectadd.u33jp13.mongodb.net/
// mongodb+srv://akashmaurya8877_db_user:<db_password>@projectadd.u33jp13.mongodb.net/?retryWrites=true&w=majority&appName=projectadd



// // Import required modules
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config(); // Load environment variables

// // Initialize Express app
// const app = express();
// app.use(bodyParser.json());

// // Enable CORS (allow frontend to access backend)
// app.use(cors({
//   origin: "*", // allow all origins (for production you can restrict to your frontend URL)
//   methods: ["GET", "POST", "PUT", "DELETE"],
// }));

// // Connect to MongoDB using .env
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.error(err));

// // Define Project schema
// const projectSchema = new mongoose.Schema({
//   image: String, 
//   title: { type: String, required: true },
//   description: String,
//   technology: [String],
// });

// // Create Project model
// const Project = mongoose.model('Project', projectSchema);

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
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
