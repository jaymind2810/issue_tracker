import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store";
import { successToast } from "../../store/toast/actions-creation";

// WebSocket Context Props
interface WebSocketProviderProps {
  token: string;
  children: ReactNode;
}

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (msg: any) => void;
  chatMessages: any;
  notifications: any;
  startCall: (receiverId: number) => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
};

export const WebSocketProvider = ({ token, children }: WebSocketProviderProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: State) => state.user);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null | any>(null);
  const localStreamRef = useRef<MediaStream | null | any>(null);
  const remoteStreamRef = useRef<MediaStream | null | any>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<any>();
  const [notifications, setNotifications] = useState<any>();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/socket/?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        setChatMessages(data);
        if (String(data.from) !== String(user?.id)) {
          dispatch(successToast({ toast: true, message: "You Have New Message..!!" }));
        }
      } else if (data.type === "notification") {
        setNotifications(data);
      } else if (data.type === "rtc-signal") {
        const signal = data.signal_data;
        const from = data.from;

        if (!peerConnectionRef.current) {
          await initPeerConnection(from);
        }

        if (signal.type === "offer") {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);

          sendMessage({
            type: "rtc-signal",
            receiver_id: from,
            signal_data: answer,
          });
        } else if (signal.type === "answer") {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
        } else if (signal.candidate) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal));
        }
      }
    };

    return () => {
      socket.close();
    };
  }, [token]);

  const sendMessage = (msg: any) => {
    socketRef.current?.send(JSON.stringify(msg));
  };

  const initPeerConnection = async (receiverId: number) => {
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    setLocalStream(stream);

    stream.getTracks().forEach((track) => {
      peerConnectionRef.current!.addTrack(track, stream);
    });

    peerConnectionRef.current.ontrack = (event:any) => {
      remoteStreamRef.current = event.streams[0];
      setRemoteStream(event.streams[0]);
    };

    peerConnectionRef.current.onicecandidate = (event:any) => {
      if (event.candidate) {
        sendMessage({
          type: "rtc-signal",
          receiver_id: receiverId,
          signal_data: {
            candidate: event.candidate,
          },
        });
      }
    };
  };

  const startCall = async (receiverId: number) => {
    if (!peerConnectionRef.current) {
      await initPeerConnection(receiverId);
    }

    const offer = await peerConnectionRef.current!.createOffer();
    await peerConnectionRef.current!.setLocalDescription(offer);

    sendMessage({
      type: "rtc-signal",
      receiver_id: receiverId,
      signal_data: offer,
    });
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        sendMessage,
        chatMessages,
        notifications,
        startCall,
        localStream,
        remoteStream,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
