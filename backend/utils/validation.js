const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function checkIfCorrectId(id) {
    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function checkTokenValidity(token) {
    try {
        jwt.verify(token, process.env.SECRETKEY);
        return true;
    } catch (error) {
        return false;
    }
}

function checkIfAdmin(user) {
    if (user.type === "ADMIN") {
        return true;
    } else {
        return false;
    }
}
function checkTaskStatus(status) {
    const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]
    if (statuses.includes(status)) {
        return true
    } else {
        return false
    }
}
function checkTaskPriority(priority) {
    const priorities = ["LOW", "MEDIUM", "HIGH"]
    if (priorities.includes(priority)) {
        return true;
    } else {
        return false;
    }
}

function checkToolsMaterialsStatus(status) {
    const statuses = ["NOT_ORDERED", "ORDERED", "RECEIVED"]
    if (statuses.includes(status)) {
        return true;
    } else {
        return false;
    }
}

function checkTaskCategory(category) {
    const categories = ["DESIGN", "PLANNING", "EXECUTION", "REVIEW"]
    if (categories.includes(category)) {
        return true
    } else {
        return false;
    }
}

function checkEmail(email) {
    const mailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (mailRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}
function checkStartAndEndDate(startDate, endDate) {
    if (startDate.getTime() < endDate.getTime()) {
        return true
    } else {
        return false
    }
}
function checkUserType(type) {
    if (type === "USER" || type === "ADMIN") {
        return true;
    } else {
        return false;
    }
}
function checkPassword(password) {
    const pwdRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (pwdRegex.test(password)) {
        return true;
    } else {
        return false;
    }
}
async function comparePassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
}
async function checkAvailable(req, res) {
    return new Promise(async (resolve, reject) => {
        const { type, value } = req.query;
        if (type && value && (type === "email" || type === "login")) {
            const foundData = await schemas.Users.findOne(
                { [type]: value },
                "login email"
            );
            if (foundData) {
                reject(false);
            } else {
                resolve(true);
            }
        } else {
            reject(false);
        }
    })
        .then((resAvailable) => {
            res.json({ available: resAvailable });
        })
        .catch((notAvailable) => {
            res.json({ available: notAvailable });
        });
}
const saltRounds = 10;
async function encryptPassword(password) {
    const hash = await bcrypt
        .genSalt(saltRounds)
        .then((salt) => {
            return bcrypt.hash(password, salt);
        })
        .then((hash) => {
            return hash;
        });
    return hash;
}

module.exports = {
    checkAvailable,
    checkEmail,
    checkPassword,
    checkIfAdmin,
    checkUserType,
    checkStartAndEndDate,
    checkIfCorrectId,
    checkTokenValidity,
    comparePassword,
    encryptPassword,
    checkTaskStatus,
    checkToolsMaterialsStatus,
    checkTaskCategory,
    checkTaskPriority,
};
