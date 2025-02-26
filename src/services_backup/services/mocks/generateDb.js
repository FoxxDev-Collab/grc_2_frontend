import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to read JSON file
const readJsonFile = (filePath) => {
  try {
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return {};
  }
};

// Function to recursively get all JSON files in a directory
const getJsonFiles = (dir) => {
  let results = [];
  const items = readdirSync(dir);

  items.forEach((item) => {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getJsonFiles(fullPath));
    } else if (extname(item) === '.json' && item !== 'db.json') {
      results.push(fullPath);
    }
  });

  return results;
};

// Function to merge data preserving and concatenating arrays
const mergeData = (target, source) => {
  if (!target) target = Array.isArray(source) ? [] : {};
  
  Object.keys(source).forEach(key => {
    // Special handling for users array from auth/users.json
    if (key === 'users' && Array.isArray(source[key])) {
      if (!Array.isArray(target[key])) {
        target[key] = [];
      }
      // Add each auth user if they don't already exist
      source[key].forEach(sourceUser => {
        const existingUser = target[key].find(targetUser => 
          targetUser && targetUser.email === sourceUser.email
        );
        if (!existingUser) {
          target[key].push(sourceUser);
        }
      });
    }
    // Handle other arrays
    else if (Array.isArray(source[key])) {
      if (!Array.isArray(target[key])) {
        target[key] = [];
      }
      
      // Merge arrays
      source[key].forEach(sourceItem => {
        if (typeof sourceItem === 'object' && sourceItem !== null && 'id' in sourceItem) {
          // For objects with IDs, update or add
          const existingItem = target[key].find(targetItem => 
            targetItem && typeof targetItem === 'object' && targetItem.id === sourceItem.id
          );
          if (existingItem) {
            Object.assign(existingItem, sourceItem);
          } else {
            target[key].push(sourceItem);
          }
        } else {
          // For primitive values or objects without IDs, just add if not exists
          const exists = target[key].some(targetItem => 
            JSON.stringify(targetItem) === JSON.stringify(sourceItem)
          );
          if (!exists) {
            target[key].push(sourceItem);
          }
        }
      });
    }
    // Handle nested objects
    else if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = mergeData(target[key] || {}, source[key]);
    }
    // Handle primitive values
    else {
      target[key] = source[key];
    }
  });
  
  return target;
};

// Main function to generate db.json
const generateDb = () => {
  const dataDir = join(__dirname, 'data');
  const outputFile = join(__dirname, 'db.json');
  const jsonFiles = getJsonFiles(dataDir);

  console.log('Found JSON files:', jsonFiles);

  // Combine all JSON data
  const combinedData = jsonFiles.reduce((acc, file) => {
    console.log('Processing file:', file);
    const data = readJsonFile(file);
    return mergeData(acc, data);
  }, {});

  // Add reference data
  combinedData.enums = {
    systemStatus: [
      { id: 1, name: "active" },
      { id: 2, name: "inactive" },
      { id: 3, name: "maintenance" },
      { id: 4, name: "retired" }
    ],
    atoStatus: [
      { id: 1, name: "not_started" },
      { id: 2, name: "in_progress" },
      { id: 3, name: "approved" },
      { id: 4, name: "denied" },
      { id: 5, name: "expired" }
    ],
    securityLevel: [
      { id: 1, name: "low" },
      { id: 2, name: "moderate" },
      { id: 3, name: "high" }
    ],
    informationLevel: [
      { id: 1, name: "public" },
      { id: 2, name: "internal" },
      { id: 3, name: "confidential" },
      { id: 4, name: "restricted" }
    ],
    systemCategory: [
      { id: 1, name: "financial" },
      { id: 2, name: "operational" },
      { id: 3, name: "administrative" },
      { id: 4, name: "security" }
    ],
    networkTypes: [
      { id: 1, name: "LAN" },
      { id: 2, name: "WAN" },
      { id: 3, name: "Cloud" },
      { id: 4, name: "VPN" },
      { id: 5, name: "DMZ" }
    ],
    componentTypes: [
      { id: 1, name: "Server" },
      { id: 2, name: "Database" },
      { id: 3, name: "Application" },
      { id: 4, name: "Network Device" },
      { id: 5, name: "Security Appliance" }
    ],
    procedureTypes: [
      { id: 1, name: "Backup" },
      { id: 2, name: "Recovery" },
      { id: 3, name: "Maintenance" },
      { id: 4, name: "Security" },
      { id: 5, name: "Monitoring" }
    ]
  };

  combinedData.commonPorts = [
    { id: 1, port: 80, service: "HTTP" },
    { id: 2, port: 443, service: "HTTPS" },
    { id: 3, port: 22, service: "SSH" },
    { id: 4, port: 3306, service: "MySQL" },
    { id: 5, port: 5432, service: "PostgreSQL" }
  ];

  // Write the combined data to db.json
  writeFileSync(outputFile, JSON.stringify(combinedData, null, 2));
  console.log('Generated db.json successfully');
};

// Run the generator
generateDb();