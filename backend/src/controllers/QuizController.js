import { Sequelize } from "sequelize";
import { Quizzes,
  Questions,
  Options,
  AnswersUsers ,
} from "../models/Quiz.js";

export const saveQuiz = async (req, res) => {
  const { title, description, questions } = req.body;

  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: "Datos incompletos o inválidos" });
  }

  try {
    // Guardar el quiz
    const quiz = await Quizzes.create({ title, description });

    // Guardar cada pregunta y sus opciones
    for (const question of questions) {
      const createdQuestion = await Questions.create({
        quizId: quiz.id,
        text: question.text,
      });

      // Guardar las opciones asociadas a la pregunta
      for (const option of question.options) {
        await Options.create({
          questionId: createdQuestion.id,
          text: option.text,
          isCorrect: option.isCorrect,
        });
      }
    }

    res.status(201).json({ message: "Encuesta guardada exitosamente", quizId: quiz.id });

  } catch (error) {
    console.error("Error al guardar el quiz:", error);
    res.status(500).json({ message: "Error al guardar el quiz" });
  }
};




export const getQuizzes = async (req, res) => {
  try {
    const data = await Quizzes.findAll();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
  };


  export const getOptionsQuestions = async (req, res) => {
    try {
      const numberQuestions=25 ;
      const sociales = await Questions.findAll({include: [{ model: Options }],where: { quizId: 1 },order: Sequelize.literal('RAND()'),});
      const fisicaMatematica = await Questions.findAll({include: [{ model: Options }],where: { quizId: 2 },order: Sequelize.literal('RAND()'),});
      const ingles = await Questions.findAll({include: [{ model: Options }],where: { quizId: 3 },order: Sequelize.literal('RAND()'),});
      const lenguaje = await Questions.findAll({include: [{ model: Options }],where: { quizId: 4 },order: Sequelize.literal('RAND()'),});
      const respuestas = await AnswersUsers.findAll(
         {where: {
          //   isCorrect: 1,
           focus: 0,
            // intent: 1,
         [Sequelize.Op.or]: [
           { intent: 1 },
         ]
       }
     }
    );

      
      // Obtenemos los `questionId` de las respuestas
      const questionIds = respuestas.map((respuesta) => respuesta.questionId);
      
      // Función para excluir las preguntas repetidas
      const excluirRepetidosYLimitar = (preguntas, questionIds, limite) => {
        return preguntas
          .filter((pregunta) => !questionIds.includes(pregunta.id)) // Excluir preguntas con IDs repetidos
          .slice(0, limite); // Tomar solo el número deseado
      };
      // Excluir repetidos y limitar para cada categoría
      const socialesFiltradas = excluirRepetidosYLimitar(sociales, questionIds, numberQuestions);
      const fisicaMatematicaFiltradas = excluirRepetidosYLimitar(fisicaMatematica, questionIds, numberQuestions);
      const inglesFiltradas = excluirRepetidosYLimitar(ingles, questionIds, numberQuestions);
      const lenguajeFiltradas = excluirRepetidosYLimitar(lenguaje, questionIds, numberQuestions);

      const todasLasPreguntas = [...socialesFiltradas, ...fisicaMatematicaFiltradas, ...inglesFiltradas, ...lenguajeFiltradas];

// Función para desordenar un array
      const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

      // Combinar todas las preguntas filtradas
      todasLasPreguntas.forEach(pregunta => {
        if (pregunta.options && Array.isArray(pregunta.options)) {
          pregunta.options = shuffleArray(pregunta.options); // Desordenar las opciones
        }
      });
      
      // Desordenar el array combinado
      const preguntasDesordenadas = shuffleArray(todasLasPreguntas);
      let contador=0
      respuestas.forEach(element => {
        contador++;
        
      });
      
      console.log(contador);
      // Responder con el resultado
      res.json(preguntasDesordenadas);
      
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  };
  



  

    export const updateAnswerUser= async (req, res) => {
    const data=req.body;
  
    try {
      const userUpdate = await AnswersUsers.update(data,
        {
          where: {
            questionId: req.params.questionId,
          },
        }
      );
      res.json({ message: "respuesta editada con éxito" });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
   export const addAnswerUser = async (req, res) => {
    try {
      const data= req.body;
      const newUser = await AnswersUsers.create(data);
    res.json({ message: `agregado con éxito`,user:newUser});
    } catch (error) {
      // manejo de errores si ocurre algún problema durante la creación del usuario
      console.error("error al crear el usuario:", error);
    }
  };
  export const addAllAnswersUsers = async (req, res) => {
    try {
      const data = req.body; // Suponiendo que "data" es un array de objetos
      // Guardar múltiples registros en la base de datos
      const newUsers = await AnswersUsers.bulkCreate(data);
  
      res.json({
        message: 'Elementos agregados con éxito',
        users: newUsers
      });
    } catch (error) {
      console.error("Error al agregar los usuarios:", error);
      res.status(500).json({ message: 'Hubo un error al guardar los datos' });
    }
  };
  
  
  

  // export const addUser = async (req, res) => {
  //   try {
  //     const data= req.body;
  //   const newUser = await Users.create(data);
  //   res.json({ message: `agregado con éxito`,user:newUser});
  //   } catch (error) {
  //     // manejo de errores si ocurre algún problema durante la creación del usuario
  //     console.error("error al crear el usuario:", error);
  //   }
  // };
  
  // export const getOneUser = async (req, res) => {
  //   const { userId } = req.params;
  //   try {
  //     const user = await Users.findOne({
  //       // attributes: [
  //       //   "userId",
  //       //   "firstName",
  //       //   "secondName",
  //       //   "username",
  //       //   "ci",
  //       //   "firstLastName",
  //       //   "secondLastName",
  //       //   "photo",
  //       // ],
  //       where: { id:userId },
  //     });
  

  //     res.json(user);
  //   } catch (error) {
  //     res.status(500).json({
  //       message: error.message,
  //     });
  //   }
  // };
 

  // export const deleteUser = async (req, res) => {
  //   try {
  //     const removingUser = await Users.destroy({
  //       where: {
  //         id: req.params.userId,
  //       },
  //     });
  
  //     res.json({ message: "Usuario eleminado con éxito" });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: error.message,
  //     });
  //   }
  // };
  // export const updateUserData = async (req, res) => {
  //   const data=req.body;
  
  //   try {
  //     const userUpdate = await Users.update(data,
  //       {
  //         where: {
  //           id: req.params.userId,
  //         },
  //       }
  //     );
  //     res.json({ message: "usuario editado con éxito" });
  //   } catch (error) {
  //     res.status(500).json({
  //       message: error.message,
  //     });
  //   }
  // };
  

