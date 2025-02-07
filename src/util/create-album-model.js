export default function createAlbumModel(spotifyAlbum) {
    let album = {};

    console.log(spotifyAlbum)

    album.id = spotifyAlbum.id;
    album.name = spotifyAlbum.name;
    album.uri = spotifyAlbum.uri;

    album.artist = spotifyAlbum.artists.map((artist) => {
        return artist.name;
    }).reduce((prev, curr, index) => {
        if (index) {
            return prev + ', ' + curr
        }

        return prev + curr;
    }, '');

    if (spotifyAlbum.images && spotifyAlbum.images.length) {
        album.imageUrl = spotifyAlbum.images[0].url;
    }

    return album;
};