"use client";
import { useEffect, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
interface VoteMessage {
  sender: string;
  vote: number;
  sessionId: string;
}
const WebSocketComponent = ({ params }: { params: { sessionId: string } }) => {
  const sessionId = params.sessionId;
  const [votes, setVotes] = useState<VoteMessage[]>([]);
  const [vote, setVote] = useState<number | null>(null);
  const [sender, setSender] = useState("");
  const [reveal, setReveal] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  useEffect(() => {
    if (sessionId) {
      const sock = new SockJS("http://localhost:8080/planning-poker");
      const client = new Client({
        webSocketFactory: () => sock,
        debug: (str) => console.log(str),
      });

      client.onConnect = () => {
        console.log("Connected to server");
        client.subscribe(`/topic/votes/${sessionId}`, (message: IMessage) => {
          console.log("Received vote:", message.body);
          const receivedVote = JSON.parse(message.body) as VoteMessage;
          setVotes((prevVotes) => [...prevVotes, receivedVote]);
        });

        client.subscribe(`/topic/reveal/${sessionId}`, () => {
          console.log("Revealing votes");
          setReveal(true);
        });
      };

      client.activate();
      setStompClient(client);

      return () => {
        client.deactivate();
      };
    }
  }, [sessionId]);

  const sendVote = () => {
    if (stompClient && vote !== null && sender.trim() !== "") {
      const voteMessage: VoteMessage = {
        sender,
        vote,
        sessionId: sessionId as string,
      };
      stompClient.publish({
        destination: `/app/vote/${sessionId}`,
        body: JSON.stringify(voteMessage),
      });
    }
  };

  const revealVotes = () => {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/reveal/${sessionId}`,
        body: "",
      });
    }
  };

  return (
    <div>
      <h1>Planning Poker Session: {sessionId}</h1>
      <div>
        {votes.map((v, index) => (
          <p key={index}>
            <strong>{v.sender}:</strong> {reveal ? v.vote : "???"}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Your name"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />
      <input
        type="number"
        placeholder="Your vote (0-10)"
        value={vote !== null ? vote : ""}
        onChange={(e) => setVote(parseInt(e.target.value))}
      />
      <button onClick={sendVote}>Send Vote</button>
      <button onClick={revealVotes}>Reveal Votes</button>
    </div>
  );
};

export default WebSocketComponent;
