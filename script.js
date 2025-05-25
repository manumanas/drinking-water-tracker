
const GLASS_SIZE_ML = 250;
const MULTIPLIER = 45;
const users = JSON.parse(localStorage.getItem('users')) || {};
const currentUser = localStorage.getItem('currentUser');

if (!currentUser || !users[currentUser]) {
  alert("User not found. Returning to home.");
  window.location.href = "index.html";
}

const today = new Date().toDateString();
let userData = users[currentUser];

if (userData.lastDate !== today) {
  userData.mlDrunk = 0;
  userData.lastDate = today;
  users[currentUser] = userData;
  localStorage.setItem('users', JSON.stringify(users));
}

let weight = userData.weight;
let dailyGoalML = Math.round(weight * MULTIPLIER);
let mlDrunk = userData.mlDrunk || 0;

document.getElementById('userDisplay').textContent = `👤 User: ${currentUser} (${weight} kg)`;
document.getElementById('dailyGoalLitres').textContent = (dailyGoalML / 1000).toFixed(2);
updateStatus();

function addGlass() {
  mlDrunk += GLASS_SIZE_ML;
  if (mlDrunk > dailyGoalML) mlDrunk = dailyGoalML;
  userData.mlDrunk = mlDrunk;
  userData.lastDate = today;
  users[currentUser] = userData;
  localStorage.setItem('users', JSON.stringify(users));
  updateStatus();
}

function updateStatus() {
  const remaining = Math.max(dailyGoalML - mlDrunk, 0);
  const percent = Math.min((mlDrunk / dailyGoalML) * 100, 100);

  document.getElementById('mlDrunk').textContent = mlDrunk;
  document.getElementById('mlRemaining').textContent = remaining;
  document.getElementById('progressBar').value = percent;
}

function switchUser() {
  window.location.href = "index.html";
}

if ("Notification" in window && Notification.permission !== "denied") {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      setInterval(() => {
        new Notification("💧 Time to hydrate!", {
          body: `Hey ${currentUser}, drink 250ml!`,
        });
      }, 60 * 60 * 1000);
    }
  });
}
