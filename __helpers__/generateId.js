const crypto = require("crypto");

function generateUniquieId(){
    
    const randomUniqueId = crypto.randomUUID();
    return randomUniqueId;

}

// Set of characters to choose from: letters, numbers, and special characters
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

// Set to keep track of already generated IDs
const usedIds = new Set();

function generateUniqueShortId() {
  let id = '';

  // Generate 6 characters from the `characters` set
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }

  // Check if the ID has been generated before, regenerate if it has
  if (usedIds.has(id)) {
    return generateUniqueShortId();
  } else {
    usedIds.add(id); // Store the generated ID to avoid future repetition
    return id;
  }
}

// Example usage
// console.log(generateUniqueId());


module.exports = {generateUniquieId, generateUniqueShortId};