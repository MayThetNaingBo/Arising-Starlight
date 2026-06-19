import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import admin from "firebase-admin";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY);

const notificationSchema = new mongoose.Schema({
  recipientRole: String,
  recipientId: mongoose.Schema.Types.ObjectId,
  recipientModel: String,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  message: String,
  type: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Notification = mongoose.model("Notification", notificationSchema);
// Initialize App
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://arising-starlight.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Firebase Admin SDK. 
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
});

// MongoDB Altas Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schemas
const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    school: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional, null initially
    isVerified: { type: Boolean, default: false }, // For verification status
    verificationToken: { type: String }, // Token for email verification
    tokenExpiry: { type: Date }, // Token expiry time
    createdAt: { type: Date, default: Date.now },
});

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
});

const eventSchema = new mongoose.Schema({
    title: String,
    location: String,
    date: String,
    image: String,
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
    registrationRequests: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    ],
});

const feedbackSchema = new mongoose.Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
});



const Feedback = mongoose.model("Feedback", feedbackSchema);


const Event = mongoose.model("Event", eventSchema);

const Admin = mongoose.model("Admin", adminSchema);
const Member = mongoose.model("Member", memberSchema);

// ADMIN ROUTES

// Admin Signup
// Admin Signup
app.post("/api/admin/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const existingAdmin = await Admin.findOne({ email: normalizedEmail });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRecord = await admin.auth().createUser({
            email: normalizedEmail,
            password: password,
            displayName: "Admin",
            disabled: false,
        });

        console.log("Firebase user created:", userRecord.uid);

        const newAdmin = new Admin({
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin",
        });

        await newAdmin.save();

        res.status(201).json({
            message: "Admin signed up successfully",
            email: newAdmin.email,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to sign up admin",
            error: error.message,
        });
    }
});
app.post("/api/admin/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.toLowerCase().trim();

        const admin = await Admin.findOne({ email: normalizedEmail });
        if (!admin) {
            return res.status(400).json({ error: "Admin not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password." });
        }

        res.status(200).json({
            message: "Admin sign-in successful.",
            role: "admin",
            userId: admin._id.toString(),
        });
    } catch (error) {
        console.error("Sign-in error:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Add Member
app.post("/api/members/add", async (req, res) => {
    const { name, school, email } = req.body;

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const existingMember = await Member.findOne({ email: normalizedEmail });
        if (existingMember) {
            return res.status(400).json({ message: "Member already exists." });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);

        const newMember = new Member({
            name,
            school,
            email: normalizedEmail,
            verificationToken: token,
            tokenExpiry,
            isVerified: false,
        });

     await newMember.save();

const link = `${process.env.FRONTEND_URL}/create-password?token=${token}`;

await resend.emails.send({
   from: "Arising Starlight <noreply@yhwinfo.xyz>",
  to: normalizedEmail,
  subject: "CCA Password Setup",
  html: `
    <h2>Welcome to TPISG</h2>
    <p>Click the link below to create your password:</p>
    <a href="${link}">Create Password</a>
  `,
});

res.status(201).json({
  message: "Member added successfully. Password setup email sent.",
});
    } catch (error) {
        res.status(500).json({
            message: "Failed to add member.",
            error: error.message,
        });
    }
});
// Get All Members
app.get("/api/members", async (req, res) => {
    try {
        const members = await Member.find(); // Fetch all members
        res.status(200).json(members); // Return members as JSON
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ message: "Failed to fetch members" });
    }
});

app.delete("/api/members/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find the member to get their email
        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Delete user from Firebase Auth (Skip if not found)
        try {
            const userRecord = await admin.auth().getUserByEmail(member.email);
            await admin.auth().deleteUser(userRecord.uid);
        } catch (error) {
            console.warn(
                "Firebase user not found, skipping Firebase deletion."
            );
        }

        // Delete member from MongoDB
        await Member.findByIdAndDelete(id);

        res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
        console.error("Error deleting member:", error);
        res.status(500).json({
            message: "Failed to delete member",
            error: error.message,
        });
    }
});

app.get("/api/validate-token", async (req, res) => {
    const { token } = req.query;

    try {
        const member = await Member.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: Date.now() }, // Check expiry
        });

        if (!member) {
            return res.status(400).json({ valid: false });
        }

        res.status(200).json({ valid: true });
    } catch (error) {
        res.status(500).json({ valid: false });
    }
});

app.post("/api/create-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        const member = await Member.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: Date.now() }, // Check expiry
        });

        if (!member) {
            return res
                .status(400)
                .json({ message: "Invalid or expired token." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update member record
        member.password = hashedPassword;
        member.isVerified = true; // Mark as verified
        member.verificationToken = undefined; // Clear token
        member.tokenExpiry = undefined; // Clear expiry

        await member.save();

        res.status(200).json({ message: "Password created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to set password." });
    }
});

// Member Sign-In
app.post("/api/member/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find member by email
        const member = await Member.findOne({ email: normalizedEmail });

        // Check if member exists
        if (!member) {
            return res.status(400).json({ message: "Member not found." });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, member.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // Debugging: Log the sign-in success response
        console.log({
            message: "Sign-in successful.",
            role: "member",
            userId: member._id.toString(), // Ensure ID is converted to string
        });

        // Return success response
        res.status(200).json({
            message: "Sign-in successful.",
            role: "member",
            userId: member._id.toString(), // Include user ID in response
        });
    } catch (error) {
        // Log error if something goes wrong
        console.error("Sign-in error:", error.message);
        res.status(500).json({
            message: "Sign-in failed.",
            error: error.message,
        });
    }
});

app.put("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const { name, school, email } = req.body;

  try {
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailChanged = member.email !== normalizedEmail;

    if (emailChanged) {
      const existingMember = await Member.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (existingMember) {
        return res.status(400).json({
          message: "Another member already uses this email.",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24);

      member.email = normalizedEmail;
      member.password = undefined;
      member.isVerified = false;
      member.verificationToken = token;
      member.tokenExpiry = tokenExpiry;

      const link = `${process.env.FRONTEND_URL}/create-password?token=${token}`;

      await resend.emails.send({
        from: "Arising Starlight <noreply@yhwinfo.xyz>",
        to: normalizedEmail,
        subject: "CCA Password Setup",
        html: `
          <h2>Welcome to Arising Starlight</h2>
          <p>Your email was updated by the admin.</p>
          <p>Please click the link below to create your password:</p>
          <a href="${link}">Create Password</a>
        `,
      });
    }

    member.name = name;
    member.school = school;

    await member.save();

    res.status(200).json({
      message: emailChanged
        ? "Member updated successfully. Password setup email sent to the new email."
        : "Member updated successfully.",
    });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({
      message: "Failed to update member.",
      error: error.message,
    });
  }
});
// Get Member by ID
app.get("/api/members/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find member by ID
        const member = await Member.findById(id);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Send the found member as a response
        res.status(200).json(member);
    } catch (error) {
        console.error("Error fetching member:", error);
        res.status(500).json({ message: "Failed to fetch member data." });
    }
});

// Event Routes
app.post("/api/events", async (req, res) => {
    const { title, location, date, description, image } = req.body;

    try {
        const newEvent = new Event({
            title,
            location,
            date,
            description,
            image,
        });
        await newEvent.save();

        res.status(201).json({
            message: "Event added successfully",
            newEvent,
        });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({
            message: "Failed to add event",
            error: error.message,
        });
    }
});

app.get("/api/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message,
        });
    }
});

app.get("/api/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event); // Ensure the full event object, including `description`, is returned
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Failed to fetch event" });
    }
});

app.delete("/api/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message,
        });
    }
});

app.put("/api/events/:id", async (req, res) => {
    const { id } = req.params;
    const { title, location, date, description, image } = req.body;

    try {
        // Find the existing event
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Update fields only if provided, preserve image if not provided
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                title: title || existingEvent.title,
                location: location || existingEvent.location,
                date: date || existingEvent.date,
                description: description || existingEvent.description,
                image: image || existingEvent.image, // Preserve existing image if empty
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Event updated successfully",
            updatedEvent,
        });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({
            message: "Failed to update event",
            error: error.message,
        });
    }
});

app.get("/api/events/:id/members", async (req, res) => {
    const { id } = req.params;
    try {
        const eventMembers = await Event.findById(id).populate("members");
        res.json(eventMembers.members);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch event members" });
    }
});
app.post("/api/events/:id/remove-member", async (req, res) => {
    const { userId } = req.body;

    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Remove user from the 'members' array only
        event.members = event.members.filter((id) => id.toString() !== userId);

        await event.save();

        res.json({ success: true, message: "Member removed successfully." });
    } catch (err) {
        console.error("Error removing member:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.get("/api/notifications/admin", async (req, res) => {
  const notifications = await Notification.find({ recipientRole: "admin" })
    .sort({ createdAt: -1 });

  res.json(notifications);
});

app.get("/api/notifications/member/:memberId", async (req, res) => {
  const notifications = await Notification.find({
    recipientRole: "member",
    recipientId: req.params.memberId,
  }).sort({ createdAt: -1 });

  res.json(notifications);
});

app.put("/api/notifications/:id/read", async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  res.json(notification);
});

app.post("/api/events/:id/add-member", async (req, res) => {
    const { id } = req.params;
    const { memberId } = req.body;
    try {
        const event = await Event.findById(id);
        event.members.push(memberId);
        await event.save();
        await Notification.create({
  recipientRole: "member",
  recipientId: memberId,
  recipientModel: "Member",
  eventId: event._id,
  message: `You have been assigned to ${event.title}.`,
  type: "EVENT_ASSIGNED",
});
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add member to event" });
    }
});

app.get("/api/members", async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch members" });
    }
});
app.post("/api/events/:id/register-request", async (req, res) => {
    const { id } = req.params; // Event ID
    const { userId } = req.body; // Member ID

    try {
        console.log("Received UserId:", userId); // Debugging UserId
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Check if userId is already in requests or members
        if (
            event.registrationRequests.includes(userId) ||
            event.members.includes(userId)
        ) {
            return res
                .status(400)
                .json({ error: "Already registered or requested." });
        }
   // Add the userId to registrationRequests
        event.registrationRequests.push(userId);
        await event.save();
await Notification.create({
  recipientRole: "admin",
  eventId: event._id,
  message: `A member requested to join ${event.title}.`,
  type: "REGISTRATION_REQUEST",
});
        console.log("Updated Requests:", event.registrationRequests); // Debugging

        res.json({ success: true, message: "Registration request sent." });
    } catch (err) {
        console.error("Error registering request:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/events/:id/requests", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate(
            "registrationRequests"
        );
        if (!event) return res.status(404).json({ error: "Event not found" });

        res.json(event.registrationRequests); // Return populated requests
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/events/:id/approve-request", async (req, res) => {
    const { userId } = req.body;

    try {
        console.log("Approving request:", { eventId: req.params.id, userId });

        // Validate IDs
        if (
            !mongoose.Types.ObjectId.isValid(req.params.id) ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Fetch the event
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        const memberId = new mongoose.Types.ObjectId(userId);

        // Add user to 'members' array if not already added
        if (!event.members.includes(memberId)) {
            event.members.push(memberId); // Add to members
        }
        // Remove from registration requests
        event.registrationRequests.pull(memberId);

        // Save the updated event
        await event.save();
await Notification.create({
  recipientRole: "member",
  recipientId: memberId,
  recipientModel: "Member",
  eventId: event._id,
  message: `Your registration for ${event.title} has been approved.`,
  type: "REGISTRATION_APPROVED",
});
        console.log("Approval Successful:", event);
        res.json({
            success: true,
            message: "Member approved and added to event.",
        });
    } catch (err) {
        console.error("Approval Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/events/:id/reject-request", async (req, res) => {
    const { userId } = req.body;

    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Remove user from registrationRequests
        event.registrationRequests = event.registrationRequests.filter(
            (id) => id.toString() !== userId
        );
        await event.save();
await Notification.create({
  recipientRole: "member",
  recipientId: userId,
  recipientModel: "Member",
  eventId: event._id,
  message: `Your registration for ${event.title} has been rejected.`,
  type: "REGISTRATION_REJECTED",
});
        res.json({ success: true, message: "Request rejected successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Remove a member from an event's members list
app.delete("/api/events/:id/remove-member/:userId", async (req, res) => {
    const { id, userId } = req.params; // Event ID and Member ID

    try {
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Remove the member from the 'members' array
        event.members = event.members.filter(
            (memberId) => memberId.toString() !== userId
        );

        await event.save(); // Save the updated event

        res.json({ success: true, message: "Member removed successfully." });
    } catch (err) {
        console.error("Error removing member:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.delete("/api/events/:id/reject-request", async (req, res) => {
    const { userId } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Remove user from requests
        event.registrationRequests = event.registrationRequests.filter(
            (id) => id.toString() !== userId
        );
        await event.save();

        res.json({ success: true, message: "Request rejected." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get Admin Info by ID
app.get("/api/admin/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id).select("-password"); // Exclude password
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error("Error fetching admin:", error);
        res.status(500).json({ message: "Failed to fetch admin data." });
    }
});

// Admin Change Password
app.put("/api/admin/change-password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // Find the admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        // Check if the current password is valid
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            admin.password
        );
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Invalid current password." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin's password
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error changing password:", error.message);
        res.status(500).json({ message: "Failed to change password." });
    }
});

app.put("/api/member/change-password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // Find the member by email
        const member = await Member.findOne({ email });
        if (!member) {
            return res.status(404).json({ message: "Member not found." });
        }

        // Check if the current password is valid
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            member.password
        );
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Invalid current password." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the member's password
        member.password = hashedPassword;
        await member.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error changing password:", error.message);
        res.status(500).json({ message: "Failed to change password." });
    }
});

// Get Member Info by ID
app.get("/api/members/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find member by ID
        const member = await Member.findById(id).select("-password"); // Exclude password
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Send member details
        res.status(200).json(member);
    } catch (error) {
        console.error("Error fetching member:", error);
        res.status(500).json({ message: "Failed to fetch member data." });
    }
});

app.get("/api/members/:id/events", async (req, res) => {
    const { id } = req.params; // Member ID

    try {
        // Find all events where the member is listed in the 'members' array
        const events = await Event.find({ members: id });

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found." });
        }

        res.status(200).json(events); // Send the events list
    } catch (error) {
        console.error("Error fetching member events:", error);
        res.status(500).json({ message: "Failed to fetch events." });
    }
});

// Add Feedback
app.post("/api/feedback", async (req, res) => {
    const { email, message } = req.body;

    try {
        const newFeedback = new Feedback({ email, message });
        await newFeedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully!",
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({
            message: "Failed to submit feedback.",
        });
    }
});

// Get All Feedback (Admin)
app.get("/api/feedback", async (req, res) => {
    try {
        const feedbackList = await Feedback.find().sort({ submittedAt: -1 });
        res.status(200).json(feedbackList);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({
            message: "Failed to fetch feedback.",
        });
    }
});
app.get("/api/notifications/unread-count", async (req, res) => {
  const { role, userId } = req.query;

  const query =
    role === "admin"
      ? { recipientRole: "admin", isRead: false }
      : { recipientRole: "member", recipientId: userId, isRead: false };

  const count = await Notification.countDocuments(query);

  res.json({ count });
});
app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});
// Test Route
app.get("/hello", (req, res) => res.send("Hello"));

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);
