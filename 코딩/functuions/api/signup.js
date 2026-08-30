export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { id, pw, univ, name, exam, examDateStr } = body;
        
        const kv = context.env.USERS;
        if (!kv) {
            return new Response(JSON.stringify({ success: false, message: "KV(USERS) 바인딩 누락" }), {
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
        return new Response(JSON.stringify({ success: false, message: e.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
