import University from "../models/university.js";
import User from "../models/user.js";
import {transliterate} from "../utils/transliteration.js";

class UniversityController {

    // Создание университета
    async createUniversity(req, res) {
        try {

            const universityFromDb = await University.findOne({full_name: req.body.full_name})

            if (!universityFromDb) {
                const userFromDb = await User.findOne({clientId: req.body.author_id})

                if (userFromDb) {
                    const university = new University({
                        full_name: req.body.full_name,
                        short_name: req.body.short_name,
                        city: req.body.city,
                        is_moderated: true,
                        author_id: req.body.author_id,
                        type: req.body.type || 'ORGANIZATION',
                        created_at: new Date(),
                        url: req.body.url,
                        code: transliterate(req.body.short_name).toUpperCase()
                    });
                    const savedUniversity = await university.save();
                    return res.status(201).json(savedUniversity);
                }
            }

            return res.status(400).json({message: 'Произошла ошибка при создании учебного заведения'})
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Получение списка всех университетов
    async getAllUniversities(req, res) {
        try {
            const _uuid = req.query.user
            console.log('uuid', _uuid)
            const universities = await University.find({
                $or: [{ is_moderated: true }, { author_id: _uuid }],
              })
            res.json(universities)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Получение информации о конкретном университете
    async getUniversity(req, res) {
        try {
            const university = await University.findById(req.params.id);
            res.json(university);
        } catch (error) {
            res.status(404).json({ error: 'Учебное заведение не найдено' });
        }
    }
    // Получение информации о конкретном университете
    async getOneUniversityByCode(req, res) {
        try {
            const university = await University.findOne({ code: req.params.code.toUpperCase()});
            res.json(university);
        } catch (error) {
            res.status(404).json({ error: 'Учебное заведение не найдено' });
        }
    }

    // Получение списка университетов по типу
    async getUniversityByType(req, res) {
        try {
            const universities = await University.find({ type: req.params.type });
            res.json(universities);
        } catch (error) {
            res.status(404).json({ error: 'Учебные заведения не найдены' });
        }
    }

    // Получение списка университетов по городу
    async getUniversityByCity (req, res) {
        try {
            const universities = await University.find({ city: req.params.city });
            res.json(universities);
        } catch (error) {
            res.status(404).json({ error: 'Учебные заведения не найдены' });
        }
    }

    // Получение списка университетов по коду
    // async getUniversityByCode (req, res) {
    //     try {
    //         const universities = await University.find({ code: req.params.code.toUpperCase() });
    //         res.json(universities);
    //     } catch (error) {
    //         res.status(404).json({ error: 'Учебные заведения не найдены' });
    //     }
    // }

    // Обновление информации о университете
    async updateUniversity(req, res) {
        try {
            const updatedUniversity = await University.findByIdAndUpdate(
                req.params.id,
                {
                    full_name: req.body.full_name,
                    short_name: req.body.short_name,
                    city: req.body.city,
                    type: req.body.type,
                    is_moderated: req.body.is_moderated,
                    author_id: req.body.author_id,
                },
                { new: true }
            );
            res.json(updatedUniversity);
        } catch (error) {
            res.status(404).json({ error: 'Учебное заведение не найдено' });
        }
    }

    // Удаление университета
    async deleteUniversity(req, res) {
        try {

            // const deletedUniversity = await University.findByIdAndDelete(req.params.id);
            // res.json(deletedUniversity);
        } catch (error) {
            // res.status(404).json({ error: 'Университет не найден' });
            res.status(403).json({ error: 'Доступ запрещен' });
        }
    }
}

export default UniversityController