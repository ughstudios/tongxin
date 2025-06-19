export default function VideoEmbed({ url }) {
  if (!url) return null
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/
  )
  if (yt) {
    const start = url.match(/[?&]t=(\d+)/)
    const param = start ? `?start=${start[1]}` : ''
    return (
      <iframe
        src={`https://www.youtube.com/embed/${yt[1]}${param}`}
        className="w-full mb-2"
        height="315"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  const tk = url.match(/tiktok\.com\/.+\/video\/(\d+)/)
  if (tk) {
    return (
      <iframe
        src={`https://www.tiktok.com/embed/v2/${tk[1]}`}
        className="w-full mb-2"
        height="560"
        allowFullScreen
      />
    )
  }

  const bv = url.match(/bilibili\.com\/video\/([a-zA-Z0-9]+)/)
  if (bv) {
    return (
      <iframe
        src={`https://player.bilibili.com/player.html?bvid=${bv[1]}`}
        className="w-full mb-2"
        height="360"
        allowFullScreen
      />
    )
  }

  const xhs = url.match(/xiaohongshu\.com\/([a-zA-Z0-9]+)/)
  if (xhs) {
    return (
      <iframe
        src={`https://www.xiaohongshu.com/embed/${xhs[1]}`}
        className="w-full mb-2"
        height="560"
        allowFullScreen
      />
    )
  }

  return <video src={url} controls className="w-full mb-2" />
}
