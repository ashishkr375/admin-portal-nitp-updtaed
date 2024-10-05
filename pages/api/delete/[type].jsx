import { NextApiHandler } from 'next'
import { query } from '../../../lib/db'
import { getSession } from 'next-auth/client'

const handler = async (req, res) => {
    const session = await getSession({ req })

    if (session) {
        const { type } = req.query
        try {
            let params = req.body
            // console.log(params);

            if (
                session.user.role === 1 ||
                session.user.role === 2 ||
                session.user.role === 4
            ) {
                if (type == 'notice') {
                    let result = await query(
                        `DELETE from notices WHERE id = ${params}`
                    )
                    return res.json(result)
                }
            }

            if (session.user.role == 1) {
                if (type == 'user' && session.user.role == 1) {
                    let array = [
                        'curr_admin_responsibility',
                        'education',
                        'memberships',
                        'past_admin_responsibility',
                        'phd_candidates',
                        'professional_service',
                        'project',
                        'publications',
                        'subjects_teaching',
                        'work_experience',
                        'users',
                        'patents',
                    ]
                    for (let i = 0; i < array.length; i++) {
                        let element = array[i]
                        let data = await query(
                            `DELETE FROM ${element} WHERE email="${params}";`
                        ).catch((e) => {
                            console.log(e)
                        })
                    }
                    return res.json({ message: 'USER DELETED SUCCESSFULLY .' })
                } else if (type == 'event') {
                    // console.log(params);
                    let result = await query(
                        `DELETE from events WHERE id = ${params}`
                    )
                    return res.json(result)
                } else if (type == 'innovation') {
                    let result = await query(
                        `delete from innovation WHERE id = ${params}`
                    )
                    return res.json(result)
                } else if (type == 'news') {
                    let result = await query(
                        `delete from news WHERE id = ${params}`
                    )
                    return res.json(result)
                }
            }

            params = JSON.parse(req.body)
            if (session.user.email == params.email) {
                if (type == 'memberships') {
                    let result = await query(
                        `delete from memberships WHERE id = ${params.id}`
                    )
                    return res.json(result)
                } else if (type == 'image') {
                    let result = await query(
                        `delete from faculty_image WHERE email = "${params.email}"`
                    )
                    return res.json(result)
                } else if (type == 'current-responsibility') {
                    let result = await query(
                        `delete from curr_admin_responsibility WHERE id = ${params.id}`
                    )
                    return res.json(result)
                } else if (type == 'past-responsibility') {
                    let result = await query(
                        `delete from past_admin_responsibility WHERE id = ${params.id}`
                    )
                    return res.json(result)
                } else if (type == 'workexperience') {
                    let result = await query(
                        `delete from work_experience WHERE id = ${params.id}`
                    )
                    return res.json(result)
                } else if (type == 'subjects') {
                    let result = await query(
                        `delete from subjects_teaching WHERE id = ${params.id}`
                    )
                    return res.json(result)
                } else if (type == 'publications') {
                    console.log(params.new_data.length)
                    let data = JSON.stringify(params.new_data)
                    let result = await query(
                        `UPDATE publications SET publications=? WHERE email=?`,
                        [data, params.email],
                        (err) => console.log(err)
                    )
                    return res.json(result)
                } else if (type == 'pub-pdf') {
                    let result = await query(
                        `UPDATE publications SET pub_pdf='' WHERE email=?`,
                        [params.email],
                        (err) => console.log(err)
                    )
                    return res.json(result)
                } else if (type == 'project') {
                    let result = await query(
                        `delete from project WHERE id = ${params.id}`
                    )
                    return res.json(result)
                } else if (type == 'professionalservice') {
                    let result = await query(
                        `delete from Professional_Service WHERE id = ${params.id}`
                    )
                    return res.json(result)
                } else if (type == 'education') {
                    let result = await query(
                        `delete from education WHERE id = ${params.id}`
                    )
                    return res.json(result)
                }else if (type == 'patent') {
                    // Handling for patents deletion
                    let result = await query(
                        `DELETE FROM patents WHERE id = ?`,
                        [params.id]
                    )
                    return res.json(result)}
                     else if (type == 'phdcandidates') {
                    let result = await query(
                        `delete from phd_candidates WHERE id = ${params.id}`
                    )
                    return res.json(result)
                }
            } else {
                return res.json({ message: 'Could not find matching requests' })
            }
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    } else {
        res.status(403).json({ message: 'You are not authorized' })
    }
}

export default handler
