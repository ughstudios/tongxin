export async function addRepostInfo(posts, PostModel) {
  const arr = Array.isArray(posts) ? posts : [posts]
  if (!arr.length) return Array.isArray(posts) ? arr : arr[0]

  const ids = arr.map(p => p.id)
  const counts = await PostModel.findAll({
    attributes: [
      'repostId',
      [PostModel.sequelize.fn('COUNT', PostModel.sequelize.col('id')), 'count']
    ],
    where: { repostId: ids },
    group: ['repostId']
  })
  const countMap = Object.fromEntries(counts.map(c => [c.repostId, parseInt(c.get('count'), 10)]))

  const origIds = [...new Set(arr.filter(p => p.repostId).map(p => p.repostId))]
  const origs = origIds.length ? await PostModel.findAll({ where: { id: origIds } }) : []
  const origMap = new Map(origs.map(o => [o.id, o]))

  for (const p of arr) {
    p.dataValues.repostCount = countMap[p.id] || 0
    if (p.repostId) {
      const orig = origMap.get(p.repostId)
      p.dataValues.repostUserId = orig ? orig.userId : null
    }
  }

  return Array.isArray(posts) ? arr : arr[0]
}
