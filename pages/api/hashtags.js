import db from '../../models'

export default async function handler(req, res) {
  await db.sync()
  const { Hashtag, Sequelize } = db
  if (req.method === 'GET') {
    const rows = await Hashtag.findAll({
      attributes: ['tag', [Sequelize.fn('COUNT', Sequelize.col('tag')), 'count']],
      group: ['tag'],
      order: [[db.Sequelize.literal('count'), 'DESC']],
      limit: 10
    })
    return res.status(200).json(rows.map(r => ({ tag: r.tag, count: r.get('count') })))
  }
  res.status(405).end()
}
