const fileSystem = require('fs');
let data = {}

fileSystem.readFile('./src/utils/recipes.json', 'utf8', (err, jsonString) => {

    if (err) {
        console.log("File read failed:", err)
        return
    }
    
    try {
        data = JSON.parse(jsonString)
        uploadRecipes(data)
    }
    catch(err) {
        console.log('Error parsing JSON string:', err)
    }
})

async function uploadRecipes(data) {
    console.log(data[0])
    console.log(data[1])

    const update = await fetch('http://localhost:3000/api/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })

    const response = await update.json()
    console.log(response)
}

