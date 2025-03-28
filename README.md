# BERR 2243 - Aina Inarah
# BERR 2243 - Database and Cloud System
# Week 1 Exercise: Environment Setup, Git Workflows & Hello MongoDB

## Objective
Set up core development tools, learn basic Git workflows, and create a simple NodeJS script that connects to MongoDB.

## Tools to Install
1. **VSCode**: Code editor ([Download](https://code.visualstudio.com/)).
2. **NodeJS & npm**: JavaScript runtime and package manager ([Download LTS version](https://nodejs.org/)).
3. **MongoDB**: Database (local or cloud instance) ([Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)).
4. **Git**: Version control system ([Download](https://git-scm.com/)).
5. **MongoDB Compass**: GUI for MongoDB (Optional) ([Download](https://www.mongodb.com/products/compass)).

## Deliverables
1. Documented installation steps for each tool.
2. A NodeJS script that connects to MongoDB and inserts/reads a document.
3. A GitHub repository with branches (`main` and `feature/setup`).

## Lab Procedures

### Step 1: Install Development Tools
1. **Install VSCode**
   - Download from [code.visualstudio.com](https://code.visualstudio.com/).
   - Install recommended extensions: MongoDB for VSCode.

2. **Install NodeJS & npm**
   - Download the LTS version from [nodejs.org](https://nodejs.org/).
   - Verify installation:
     ```sh
     node -v
     npm -v
     ```

3. **Install MongoDB**
   - Follow the [MongoDB Community Server installation guide](https://www.mongodb.com/docs/manual/administration/install-community/).
   - Start MongoDB service:
     ```sh
     mongod --dbpath /path/to/data/db
     ```

4. **Install Git**
   - Download from [git-scm.com](https://git-scm.com/).
   - Configure Git:
     ```sh
     git config --global user.name "Your Name"
     git config --global user.email "youremail@example.com"
     ```

5. **Install MongoDB Compass (Optional)**
   - Download from [MongoDB Compass](https://www.mongodb.com/products/compass).

### Step 2: Git Basics & Repository Setup
1. **Create a GitHub Account** ([Sign Up](https://education.github.com/pack)).
2. **Create a New Git Repository**
3. **Create a README.md File** (Document your installation steps).
4. **Commit and Push to GitHub**
   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Step 3: Create a "Hello MongoDB" NodeJS Script
1. **Initialize a NodeJS Project**
   ```sh
   npm init -y
   ```
2. **Install MongoDB Driver**
   ```sh
   npm install mongodb
   ```
3. **Create `index.js`**
4. **Run the Script**
   ```sh
   node index.js
   ```
5. **Verify in MongoDB Compass**
   - Connect to MongoDB instance and check the `testDB` database.

### Step 4: Push Code to GitHub
1. **Create a `.gitignore` File**
2. **Add `node_modules` into `.gitignore`**
3. **Commit Changes**
   ```sh
   git add .
   git commit -m "Added MongoDB connection script"
   git push origin main
   ```