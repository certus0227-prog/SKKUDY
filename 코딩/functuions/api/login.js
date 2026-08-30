export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { id, pw } = body;
        const kv = context.env.USERS;

        const dataStr = await kv.get(id);
        if (!dataStr) {
            return new Response(JSON.stringify({ success: false, message: "존재하지 않는 아이디입니다." }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = JSON.parse(dataStr);
        if (user.pw !== pw) {
            return new Response(JSON.stringify({ success: false, message: "비밀번호가 틀렸습니다." }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true, user }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: e.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
