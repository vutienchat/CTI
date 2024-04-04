let dialer = document.querySelector(".dialer");
let outBoundScreen = document.querySelector(".out-bound-screen-wrapper");
let acceptCallBtn = document.querySelector("#accept-call-btn");

let agent = anCti.newAgent();
let webphone;
let audio = new Audio();
audio.autoplay = true;

agent.startApplicationSession({
  username: "chatvt@sphinxjsc.com",
  password: "Abc123456",
  url: "wss://as7presales.apac-ancontact.com/cti/ws",
});

agent.on("applicationsessionterminated", (event) => {
  if (event.reason == "invalidApplicationInfo") {
    console.log("Please check your credentials and try again");
  }
});

agent.on("applicationsessionstarted", (event) => {
  console.log("Hello " + event.firstName);
});

agent.on("applicationsessionstarted", (event) => {
  webphone = agent.getDevice("sip:1002@term.323");

  webphone.monitorStart({ rtc: true });
});

agent.on("call", (event) => {
  let call = event.call;
  switch (call.localConnectionInfo) {
    case "alerting":
      console.log(`incomming call from ${call.number} ${call.name}`);
      dialer.style.display = "none";
      outBoundScreen.style.display = "block";
      break;
    case "connected":
      console.log(`connected to ${call.number}`);
      break;
    case "fail":
      console.log(`call failed, cause is ${event.content.cause}`);
      break;
    case "hold":
      console.log(`holding call to ${call.number}`);
      break;
    case "null":
      console.log(`call to ${call.number} is gone`);
      break;
  }
});

acceptCallBtn.onclick = () => {
  let call = webphone.calls[0];
  if (call.localConnectionInfo === "alerting") {
    call.answerCall({ audio: true, video: false });
  }
};
