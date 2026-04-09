import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

export default async post => {
  const { title, description, author } = post.data;
  const postAuthor = author || SITE.author;
  const postDesc = description || "";
  const siteHostname = new URL(SITE.website).hostname;

  return satori(
    {
      type: "div",
      props: {
        style: {
          background: "#fefbfb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-1px",
                right: "-1px",
                border: "4px solid #000",
                background: "#ecebeb",
                opacity: "0.9",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2.5rem",
                width: "88%",
                height: "80%",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                border: "4px solid #000",
                background: "#fefbfb",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2rem",
                width: "88%",
                height: "80%",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin: "20px",
                    width: "90%",
                    height: "90%",
                  },
                  children: [
                    // 제목 + 설명 영역
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          overflow: "hidden",
                        },
                        children: [
                          // 제목
                          {
                            type: "p",
                            props: {
                              style: {
                                fontSize: 64,
                                fontWeight: "bold",
                                lineHeight: 1.2,
                                overflow: "hidden",
                                marginBottom: "16px",
                              },
                              children: title,
                            },
                          },
                          // 설명 (있을 경우)
                          ...(postDesc
                            ? [
                                {
                                  type: "p",
                                  props: {
                                    style: {
                                      fontSize: 28,
                                      color: "#666",
                                      overflow: "hidden",
                                      lineHeight: 1.5,
                                    },
                                    children: postDesc,
                                  },
                                },
                              ]
                            : []),
                        ],
                      },
                    },
                    // 하단: 작성자(좌) + URL(우)
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: 24,
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              style: { overflow: "hidden", fontWeight: "bold" },
                              children: postAuthor,
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { overflow: "hidden", fontWeight: "bold" },
                              children: siteHostname,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(
        title + postDesc + postAuthor + SITE.title + "by"
      ),
    }
  );
};
