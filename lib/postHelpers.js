export async function addRepostInfo(posts, PostModel) {
  const arr = Array.isArray(posts) ? posts : [posts]
  for (const p of arr) {
    p.dataValues.repostCount = await PostModel.count({ where: { repostId: p.id } })
    if (p.repostId) {
      const orig = await PostModel.findByPk(p.repostId)
      p.dataValues.repostUserId = orig ? orig.userId : null
    }
  }
  return Array.isArray(posts) ? arr : arr[0]
}
