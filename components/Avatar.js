export default function Avatar({ url, size = 32 }) {
  return (
    <img
      src={url || '/avatar-default.svg'}
      alt="avatar"
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  )
}
