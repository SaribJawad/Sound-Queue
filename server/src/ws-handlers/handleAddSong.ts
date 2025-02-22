import { Song } from "src/models/song.model";
import { Stream } from "src/models/stream.model";
import { addSongSchema } from "src/schema/addSongSchema";
import { extractYouTubeID } from "src/utils/extractYoutubeId";
import { WebSocket } from "ws";

//@ts-ignore
import youtubesearchapi from "youtube-search-api";

interface JoinRoomProps {
  currentRoom: string | null;
  data: { action: string; url: string };
  rooms: Map<string, Set<WebSocket>>;
}

export async function handleAddSong({
  currentRoom,
  data,
  rooms,
}: JoinRoomProps) {
  if (!currentRoom) return;
  console.log(currentRoom, "streammmmm");
  const stream = await Stream.findById(currentRoom);

  if (!stream) throw new Error("Stream not URL");
  console.log(data.url, "YOUTUBE URL");
  const extractedId = extractYouTubeID(data.url);

  if (!extractedId) {
    throw new Error("Invalid youtube URL");
  }

  const {
    id,
    title,
    channel,
    thumbnail: { thumbnails },
  } = await youtubesearchapi.GetVideoDetails(extractedId);

  console.log(stream._id, thumbnails[thumbnails.length - 1].url);

  const validatedData = addSongSchema.parse({
    externalId: id,
    title,
    source: stream.streamType,
    artist: channel,
    coverImageUrl: thumbnails[thumbnails.length - 1].url,
    stream: stream._id.toString(),
  });

  const song = await Song.create(validatedData);

  if (!song) {
    throw new Error("Something went wrong while adding song");
  }

  let updateQuery;
  if (!stream.currentSong && stream.songQueue.length === 0) {
    updateQuery = { currentSong: song };
  } else {
    updateQuery = { $push: { songQueue: song } };
  }

  const updatedStream = await Stream.findByIdAndUpdate(
    stream._id,
    updateQuery,
    { new: true }
  );

  if (!updatedStream) {
    throw new Error("Something went wrong while adding strong the stream");
  }

  if (currentRoom && rooms.has(currentRoom)) {
    rooms.get(currentRoom)?.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log(data, "sending");
        client.send(JSON.stringify({ action: "addSong", song }));
      }
    });
  }
  return;
}
