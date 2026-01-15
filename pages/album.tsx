import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const FONT_OPTIONS = [
  "ark",
  "arthur",
  "awesome",
  "compass",
  "corset",
  "desert",
  "dust",
  "fear",
  "holotype",
  "hungry",
  "kobold",
  "lookout",
  "loser",
  "match",
  "memo",
  "nope",
  "outflank",
  "passage",
  "rude",
  "saga",
  "salty",
  "sins",
  "vest",
  "winds",
  "xerxes",
  "yesterday",
];

const PALETTE_OPTIONS: [string, string, string, string][] = [
  ["#46425E", "#D17C7C", "#5B768D", "#F6C6A8"],
];

interface Song {
  title: string;
  file: File | null;
  order: number;
  featuringArtist: string;
  songDescription: string;
}

const AlbumUpload = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);

  // Form state
  const [albumName, setAlbumName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artistBiography, setArtistBiography] = useState("");
  const [fontChoice, setFontChoice] = useState("saga");
  const [paletteChoice, setPaletteChoice] = useState<
    [string, string, string, string]
  >(PALETTE_OPTIONS[0]);
  const [albumCover, setAlbumCover] = useState<File | null>(null);
  const [songs, setSongs] = useState<Song[]>([
    {
      title: "",
      file: null,
      order: 1,
      featuringArtist: "",
      songDescription: "",
    },
  ]);

  const addSong = () => {
    setSongs([
      ...songs,
      {
        title: "",
        file: null,
        order: songs.length + 1,
        featuringArtist: "",
        songDescription: "",
      },
    ]);
  };

  const removeSong = (index: number) => {
    if (songs.length > 1) {
      const newSongs = songs.filter((_, i) => i !== index);
      // Reorder remaining songs
      newSongs.forEach((song, i) => {
        song.order = i + 1;
      });
      setSongs(newSongs);
    }
  };

  const updateSong = (index: number, field: keyof Song, value: any) => {
    const newSongs = [...songs];
    newSongs[index] = { ...newSongs[index], [field]: value };
    setSongs(newSongs);
  };

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width === 64 && img.height === 64) {
          resolve(true);
        } else {
          setError(
            `Album cover must be exactly 64x64 pixels (yours is ${img.width}x${img.height})`,
          );
          resolve(false);
        }
      };
      img.onerror = () => {
        setError("Failed to load album cover image");
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const validateForm = async (): Promise<boolean> => {
    if (!albumName.trim()) {
      setError("Album name is required");
      return false;
    }
    if (!artistName.trim()) {
      setError("Artist name is required");
      return false;
    }
    if (!albumCover) {
      setError("Album cover is required");
      return false;
    }
    if (albumCover && !albumCover.name.toLowerCase().endsWith(".png")) {
      setError("Album cover must be a PNG file");
      return false;
    }
    // Validate image dimensions
    if (albumCover) {
      const isValidSize = await validateImage(albumCover);
      if (!isValidSize) {
        return false;
      }
    }
    if (songs.length === 0) {
      setError("At least one song is required");
      return false;
    }
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      if (!song.title.trim()) {
        setError(`Song ${i + 1}: Title is required`);
        return false;
      }
      if (!song.file) {
        setError(`Song ${i + 1}: File is required`);
        return false;
      }
      const validExtensions = [".it", ".s3m", ".mod", ".vgm"];
      const hasValidExtension = validExtensions.some((ext) =>
        song.file!.name.toLowerCase().endsWith(ext),
      );
      if (!hasValidExtension) {
        setError(`Song ${i + 1}: File must be .it, .s3m, .mod, or .vgm`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Add album cover
      formData.append("albumCover", albumCover!);

      // Add song files
      songs.forEach((song) => {
        if (song.file) {
          formData.append("songFiles", song.file);
        }
      });

      // Add metadata as JSON
      const metadata = {
        albumName,
        artistName,
        fontChoice,
        palette: paletteChoice,
        artistBiography: artistBiography || undefined,
        songs: songs.map((song) => ({
          title: song.title,
          order: song.order,
          featuringArtist: song.featuringArtist || undefined,
          songDescription: song.songDescription || undefined,
        })),
      };

      formData.append("data", JSON.stringify(metadata));

      // Determine API endpoint based on environment
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? "https://album.bread.codes/upload"
          : "http://localhost:3000/upload";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      const uploadId = data.uploadId;

      // Redirect to album page with UUID
      router.push(`/album/${uploadId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upload Album - bread.codes</title>
      </Head>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          border: "3px solid #000",
          borderRadius: "0",
        }}
      >
        <center>
          <h1
            style={{
              fontFamily: "Comic Sans MS, cursive",
              color: "#ff0066",
              textShadow: "2px 2px #000",
              fontSize: "32px",
              marginBottom: "10px",
            }}
          >
            .:*~~*:. ALBUM UPLOAD .:*~~*:.
          </h1>
          <p style={{ fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>
            {/* @ts-expect-error: Marquee for retro effect */}
            <marquee behavior="alternate" width="300">
              <b>Upload your tracker music!</b>
              {/* @ts-expect-error: Marquee for retro effect */}
            </marquee>
          </p>
        </center>

        {error && (
          <div
            style={{
              backgroundColor: "#ffcccc",
              border: "2px solid #ff0000",
              padding: "10px",
              marginBottom: "15px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <b>ERROR:</b> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <table
            cellPadding={8}
            cellSpacing={0}
            border={1}
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr style={{ backgroundColor: "#ffcc00" }}>
                <td colSpan={2}>
                  <b>ALBUM INFORMATION</b>
                </td>
              </tr>
              <tr>
                <td width="30%" style={{ backgroundColor: "#e0e0e0" }}>
                  <b>Album Name:*</b>
                </td>
                <td>
                  <input
                    type="text"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "4px",
                      border: "2px inset #ccc",
                      fontFamily: "Arial, sans-serif",
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ backgroundColor: "#e0e0e0" }}>
                  <b>Artist Name:*</b>
                </td>
                <td>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "4px",
                      border: "2px inset #ccc",
                      fontFamily: "Arial, sans-serif",
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ backgroundColor: "#e0e0e0" }}>
                  <b>Font Choice:*</b>
                </td>
                <td>
                  <select
                    value={fontChoice}
                    onChange={(e) => setFontChoice(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "4px",
                      border: "2px inset #ccc",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ backgroundColor: "#e0e0e0" }}>
                  <b>Palette Choice:*</b>
                </td>
                <td>
                  <div style={{ position: "relative" }}>
                    <div
                      onClick={() =>
                        setPaletteDropdownOpen(!paletteDropdownOpen)
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "2px inset #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        fontFamily: "Arial, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "center",
                        }}
                      >
                        {paletteChoice.map((color, i) => (
                          <div
                            key={i}
                            style={{
                              width: "24px",
                              height: "24px",
                              backgroundColor: color,
                              border: "1px solid #000",
                            }}
                          />
                        ))}
                        <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                          {paletteChoice.join(" ")}
                        </span>
                      </div>
                      <span>{paletteDropdownOpen ? "▲" : "▼"}</span>
                    </div>
                    {paletteDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          backgroundColor: "#fff",
                          border: "2px solid #000",
                          zIndex: 1000,
                          maxHeight: "300px",
                          overflowY: "auto",
                        }}
                      >
                        {PALETTE_OPTIONS.map((pal) => (
                          <div
                            key={pal.join("-")}
                            onClick={() => {
                              setPaletteChoice(pal);
                              setPaletteDropdownOpen(false);
                            }}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              borderBottom: "1px solid #ccc",
                              backgroundColor:
                                paletteChoice.join("-") === pal.join("-")
                                  ? "#e0e0e0"
                                  : "#fff",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                            onMouseEnter={(e) => {
                              if (paletteChoice.join("-") !== pal.join("-")) {
                                e.currentTarget.style.backgroundColor =
                                  "#f5f5f5";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (paletteChoice.join("-") !== pal.join("-")) {
                                e.currentTarget.style.backgroundColor = "#fff";
                              }
                            }}
                          >
                            {pal.map((color, i) => (
                              <div
                                key={i}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  backgroundColor: color,
                                  border: "1px solid #000",
                                }}
                              />
                            ))}
                            <span
                              style={{
                                fontSize: "12px",
                                fontFamily: "monospace",
                              }}
                            >
                              {pal.join(" ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ backgroundColor: "#e0e0e0" }}>
                  <b>Album Cover:*</b>
                  <br />
                  <small>(PNG, exactly 64x64)</small>
                </td>
                <td>
                  <input
                    type="file"
                    accept=".png"
                    onChange={(e) => setAlbumCover(e.target.files?.[0] || null)}
                    required
                    style={{
                      fontFamily: "Arial, sans-serif",
                    }}
                  />
                  {albumCover && (
                    <div style={{ marginTop: "5px", fontSize: "12px" }}>
                      Selected: {albumCover.name}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ backgroundColor: "#e0e0e0" }}>
                  <b>Artist Biography:</b>
                  <br />
                  <small>(optional)</small>
                </td>
                <td>
                  <textarea
                    value={artistBiography}
                    onChange={(e) => setArtistBiography(e.target.value)}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "4px",
                      border: "2px inset #ccc",
                      fontFamily: "Arial, sans-serif",
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <table
              cellPadding={8}
              cellSpacing={0}
              border={1}
              style={{
                width: "100%",
                backgroundColor: "#ffffff",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr style={{ backgroundColor: "#00ccff" }}>
                  <td colSpan={2}>
                    <b>SONGS</b>
                  </td>
                </tr>
                {songs.map((song, index) => (
                  <React.Fragment key={index}>
                    <tr style={{ backgroundColor: "#ccffcc" }}>
                      <td colSpan={2}>
                        <b>Song #{song.order}</b>
                        {songs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSong(index)}
                            style={{
                              marginLeft: "10px",
                              padding: "2px 8px",
                              backgroundColor: "#ff6666",
                              border: "2px outset #ff3333",
                              cursor: "pointer",
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td width="30%" style={{ backgroundColor: "#e0e0e0" }}>
                        <b>Song Title:*</b>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={song.title}
                          onChange={(e) =>
                            updateSong(index, "title", e.target.value)
                          }
                          required
                          style={{
                            width: "100%",
                            padding: "4px",
                            border: "2px inset #ccc",
                            fontFamily: "Arial, sans-serif",
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "#e0e0e0" }}>
                        <b>Song File:*</b>
                        <br />
                        <small>(.it, .s3m, .mod, .vgm)</small>
                      </td>
                      <td>
                        <input
                          type="file"
                          accept=".it,.s3m,.mod,.vgm"
                          onChange={(e) =>
                            updateSong(
                              index,
                              "file",
                              e.target.files?.[0] || null,
                            )
                          }
                          required
                          style={{
                            fontFamily: "Arial, sans-serif",
                          }}
                        />
                        {song.file && (
                          <div style={{ marginTop: "5px", fontSize: "12px" }}>
                            Selected: {song.file.name}
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "#e0e0e0" }}>
                        <b>Order:</b>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={song.order}
                          onChange={(e) =>
                            updateSong(
                              index,
                              "order",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          min={1}
                          required
                          style={{
                            width: "80px",
                            padding: "4px",
                            border: "2px inset #ccc",
                            fontFamily: "Arial, sans-serif",
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "#e0e0e0" }}>
                        <b>Featuring Artist:</b>
                        <br />
                        <small>(optional)</small>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={song.featuringArtist}
                          onChange={(e) =>
                            updateSong(index, "featuringArtist", e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "4px",
                            border: "2px inset #ccc",
                            fontFamily: "Arial, sans-serif",
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: "#e0e0e0" }}>
                        <b>Song Description:</b>
                        <br />
                        <small>(optional)</small>
                      </td>
                      <td>
                        <textarea
                          value={song.songDescription}
                          onChange={(e) =>
                            updateSong(index, "songDescription", e.target.value)
                          }
                          rows={2}
                          style={{
                            width: "100%",
                            padding: "4px",
                            border: "2px inset #ccc",
                            fontFamily: "Arial, sans-serif",
                          }}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <center style={{ marginTop: "10px" }}>
              <button
                type="button"
                onClick={addSong}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#66ff66",
                  border: "3px outset #33cc33",
                  cursor: "pointer",
                  fontFamily: "Comic Sans MS, cursive",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                + ADD ANOTHER SONG +
              </button>
            </center>
          </div>

          <center style={{ marginTop: "20px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 40px",
                backgroundColor: loading ? "#cccccc" : "#ff6600",
                border: "3px outset #cc5500",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Comic Sans MS, cursive",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#ffffff",
                textShadow: "1px 1px #000",
              }}
            >
              {loading ? "UPLOADING..." : ">>> SUBMIT ALBUM <<<"}
            </button>
          </center>
        </form>

        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#ffffcc",
            border: "2px dashed #000",
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
          }}
        >
          <b>* = Required field</b>
          <br />
          Album cover must be PNG format and exactly 64x64 pixels!
          <br />
          Song files must be tracker formats: .it, .s3m, .mod, or .vgm
        </div>
      </div>
    </>
  );
};

export default AlbumUpload;
