let playing = false;

document.getElementById("playBtn").addEventListener("click", () => {
  playing = !playing;
  document.getElementById("playBtn").innerText = playing ? "⏸" : "▶";
});

/* CHAT SIMPLES */
function sendMsg() {
  const input = document.getElementById("msg");
  const chat = document.getElementById("chatBox");

  if (input.value.trim() === "") return;

  const msg = document.createElement("div");
  msg.innerText = "Você: " + input.value;

  chat.appendChild(msg);
  input.value = "";

  chat.scrollTop = chat.scrollHeight;
}
