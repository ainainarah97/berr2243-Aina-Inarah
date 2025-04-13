const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const drivers = [
    {
        name: "John Doe",
        vehicleType: "Sedan",
        isAvailable: true,
        rating: 4.8
    },
    {
        name: "Alice Smith",
        vehicleType: "SUV",
        isAvailable: false,
        rating: 4.2
    },
    {
        name: "Alia Irdina",
        vehicleType: "Sports Car",
        isAvailable: false,
        rating: 4.1
    },
    {
        name: "Aniq Zuhayr",
        vehicleType: "Hatchback",
        isAvailable: true,
        rating: 4.6
    },
    {
        name: "Athirah Insyirah",
        vehicleType: "Electric Car",
        isAvailable: false,
        rating: 4.7
    },
];

//task 2.1
console.log(drivers);
drivers.forEach(driver => {
    console.log(driver.name);
});

//task 2.2
drivers.push({
    name: "Aina Inarah",
    vehicleType: "MPV",
    rating: 4.4,
    isAvailable: true
});

console.log(drivers);
drivers.forEach(driver => console.log(driver.name));
console.log("New driver added");

async function main() {
    try {
        //task 3
        await client.connect();
        console.log("Connected to MongoDB!");

        const db = client.db("testDB");
        const driverCollection = db.collection("drivers");

        const deletedAll = await driverCollection.deleteMany({});

        await driverCollection.insertMany(drivers);
        console.log("Drivers Inserted!");

        //task 4
        const highRatedDrivers = await driverCollection.find({
            rating: { $gte: 4.5 },
            isAvailable: true
        }).toArray();

        console.log("High Rated Available Drivers:");
        highRatedDrivers.forEach(driver =>
            console.log(`${driver.name} (${driver.vehicleType}) - Rating: ${driver.rating}`)
        );

         //print all drivers before update
        console.log("All drivers before update:");
        const before = await driverCollection.find().toArray();
        console.log(before);

        //task 5
        const updateResult = await driverCollection.updateMany( //modified question
            {}, // empty filter updates all
            { $inc: { rating: 0.1 } }
        );

        console.log(`\nUpdated ${updateResult.modifiedCount} driver(s)' ratings by 0.1`);


        //print all drivers after update
        console.log("All drivers after update:");
        const after = await driverCollection.find().toArray();
        console.log(after);

        //task 6
        console.log("\nAll drivers before deletion:");
        const allDriversBefore = await driverCollection.find().toArray();
        allDriversBefore.forEach(driver => {
            console.log(`${driver.name} - Available: ${driver.isAvailable}`);
        });

        
        const deleteResult = await driverCollection.deleteMany({ isAvailable: false }); //modified question

        console.log(`\nDeleted ${deleteResult.deletedCount} unavailable driver(s).`);

        console.log("\nAll drivers after deletion:");
        const allDriversAfter = await driverCollection.find().toArray();
        allDriversAfter.forEach(driver => {
            console.log(`${driver.name} - Available: ${driver.isAvailable}`);
        });


    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

main();
