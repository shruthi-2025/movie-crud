
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/movies")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Movie Schema
const Movie = mongoose.model("Movie", {
    title: String,
    genre: String,
    year: Number,
    rating: Number,
    director: String
});

// ADD MOVIE
app.post("/add", async (req, res) => {
    try {
        await Movie.create(req.body);
        res.send("Movie Added Successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// VIEW ALL MOVIES
app.get("/movies", async (req, res) => {
    try {
        res.json(await Movie.find());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SEARCH MOVIE
app.get("/search/:title", async (req, res) => {
    try {
        const movies = await Movie.find({
            title: { $regex: req.params.title, $options: "i" }
        });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE MOVIE
app.put("/update/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).send("Movie Not Found");
        }

        res.json({
            message: "Movie Updated Successfully",
            movie: movie
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE MOVIE
app.delete("/delete/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).send("Movie Not Found");
        }

        res.send("Movie Deleted Successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// START SERVER
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
