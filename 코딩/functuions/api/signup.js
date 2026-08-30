export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { id, pw, univ, name, exam, examDateStr } = body;
        
        const kv = context.env.USERS;
        if (!kv) {
            return new Response(JSON.stringify({ success: false, message: "에러: KV 바인딩(USERS)이 연결되지 않았습니다!" }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const existing = await kv.get(id);
        if (existing) {
            return new Response(JSON.stringify({ success: false, message: "이미 존재하는 아이디입니다." }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userData = { id, pw, univ, name, exam, examDateStr, records: [], events: {} };
        await kv.put(id, JSON.stringify(userData));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        // 서버에서 발생한 진짜 에러 메시지를 브라우저에 그대로 반환합니다.
        return new Response(JSON.stringify({ success: false, message: "서버 내부 오류: " + e.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200 // 에러 내용을 확실히 읽을 수 있게 200으로 응답
        });
    }
}
