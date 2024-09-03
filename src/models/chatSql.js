// 방 생성 쿼리 (title을 null로 생성)
export const createRoomSQL = `
    INSERT INTO ROOMS (user_id, room_title, created_at)
    VALUES (?, NULL, NOW())
`;

// 방 제목 업데이트 쿼리
export const updateRoomTitleSQL = `
    UPDATE ROOMS
    SET room_title = ?
    WHERE room_id = ?
`;

// 최근 생성된 방 조회 쿼리
export const getRecentUpdatedRoomSQL = `
    SELECT MAX(room_id) AS room_id
    FROM ROOMS
    WHERE user_id = ?;
`;

// 메시지 저장 쿼리
export const saveMessageSQL = `
    INSERT INTO CHAT (room_id, user_id, role, content, created_at)
    VALUES (?, ?, ?, ?, NOW())
`;

// 메시지 개수 조회 쿼리 (첫 메시지 여부 확인)
export const getMessageCountByRoomIdSQL = `
    SELECT COUNT(*) AS messageCount
    FROM CHAT
    WHERE room_id = ?
`;

export const getChatListSQL = `
    SELECT 
        r.room_id, 
        r.room_title,
        MAX(c.created_at) AS last_message_time
    FROM ROOMS r
    LEFT JOIN CHAT c ON r.room_id = c.room_id
    WHERE r.user_id = ?
    GROUP BY r.room_id, r.room_title
    ORDER BY last_message_time DESC
`;


// 채팅방의 모든 메시지 조회 쿼리
export const getChatMessagesSQL = `
    SELECT c.created_at, c.role, c.content
    FROM CHAT c
    JOIN ROOMS r ON c.room_id = r.room_id
    WHERE r.user_id = ? AND r.room_title = ?
    ORDER BY c.created_at ASC
`;
