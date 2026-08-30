export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        if (!env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({ error: "OpenAI API Key가 설정되지 않았습니다." }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const data = await request.json();
        const { sourceText } = data;

        if (!sourceText) {
            return new Response(JSON.stringify({ error: "분석할 학습 텍스트가 없습니다." }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const prompt = `다음 학습 내용을 바탕으로 핵심 단어나 개념 3개를 골라 빈칸 채우기 퀴즈를 만들어주세요. 
반드시 아래 JSON 형식으로만 응답해주세요. (마크다운 백틱 사용 금지)
{
  "quizText": "퀴즈 문장 (빈칸은 ______ 로 표시)",
  "answers": ["정답1", "정답2", "정답3"]
}

학습 내용:
${sourceText}`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error?.message || "OpenAI API 호출 실패");
        }

        const content = result.choices[0].message.content.trim();
        const cleanJson = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const quizData = JSON.parse(cleanJson);

        return new Response(JSON.stringify({ success: true, quiz: quizData }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
