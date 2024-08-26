// import { Client } from "@notionhq/client";
// import config from "config";

// const notion = new Client({
//   auth: config.get("NOTION_KEY"),
// });

// export async function create(short, text) {
//   try {

//     // Добавляем логирование перед запросом к Notion API
//     console.log("NOTION_DB_ID:", config.get("NOTION_DB_ID"));
//     console.log("NOTION_KEY:", config.get("NOTION_KEY"));

//   const response = await notion.pages.create({
//     parent: { database_id: config.get("NOTION_DB_ID") },
//     properties: {
//       Name: {
//         title: [
//           {
//             text: {
//               content: short,
//             },
//           },
//         ],
//       },
//       Date: {
//         date: {
//           start: new Date().toISOString(),
//         },
//       },
//     },
//   });

//   const pageResponse =  await notion.blocks.children.append({
//     block_id: response.id,
//     children: [
//       {
//         object: "block",
//         type: "paragraph",
//         paragraph: {
//           rich_text: [
//             {
//               type: "text",
//               text: {
//                 content: text,
//               },
//             },
//           ],
//         },
//       },
//     ],
//   });

//   return response;
// } catch (error) {
//   console.error("Error creating page in Notion:", error);
//   return null;
// }
// }

import { Client } from "@notionhq/client";
import config from "config";

const notion = new Client({
  auth: config.get("NOTION_KEY"), // Обновите токен
});

const databaseId = config.get("NOTION_DB_ID"); // Убедитесь, что это правильный идентификатор базы данных

export async function create(short, text) {
  try {
    // Проверка базы данных
    await notion.databases.retrieve({
      database_id: databaseId,
    });
    // console.log("Database retrieved successfully");

    // Создание страницы
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: short,
              },
            },
          ],
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    // Добавление блока
    await notion.blocks.children.append({
      block_id: response.id,
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: text,
                },
              },
            ],
          },
        },
      ],
    });

    return response;
  } catch (error) {
    console.error("Error creating page in Notion:", error);
    return null;
  }
}
