document.addEventListener('DOMContentLoaded', function () {
  initComments();
});

/* ============================================================
   Datos "semilla" (comentarios falsos de prueba social)
   ============================================================ */
var SEED_COMMENTS = [
  {
    id: 'seed-0',
    name: 'Daniel Gaviria',
    img: 'images/comentario1.jpeg',
    text: 'Estaba a punto de cerrar la página, pero el Dr. Turbay fue tan directo que me quedé. Su explicación sobre por qué mi hijo retenía tan poco me abrió los ojos. Anoche hicimos las tareas sin un solo grito, y hoy... ¡llegó a casa con su primer 10/10 en el examen de matemáticas! No se salten la parte donde el doctor explica cómo destrabar su potencial.',
    likes: 74,
    time: '1 h',
    replies: [
      {
        id: 'seed-0-0',
        name: 'Fernanda P.',
        img: 'images/comentario2.webp',
        text: 'Me pasaba lo mismo, estudiar con él era una guerra diaria. Hoy, después de aplicar esto, la profesora lo felicitó en público por ser el que más rápido resolvió los ejercicios de la pizarra.',
        likes: 26,
        time: '45 m'
      },
      {
        id: 'seed-0-1',
        name: 'Olga Gomez',
        img: 'images/comentario3.webp',
        text: 'Increíble lo del Dr. Turbay. Mi hija acaba de traer a casa el diploma de excelencia del mes. Y pensar que yo le echaba la culpa al celular. Véanlo hasta el final.',
        likes: 15,
        time: '1 h'
      }
    ]
  },
  {
    id: 'seed-1',
    name: 'Isabel Quispe',
    img: 'images/comentario4.webp',
    text: 'En el colegio ya me insinuaban que tenía déficit de atención y que había que medicarlo. Este video nos dio otra salida. La forma en que el Dr. Turbay explica cómo acelerar su aprendizaje es brillante. Llevo aplicándolo unas semanas y ayer mi hijo por fin trajo un 9/10 en el examen de matemáticas que tanto lo frustraba.',
    likes: 35,
    time: '2 h',
    replies: [
      {
        id: 'seed-1-0',
        name: 'Hector Fernandez',
        img: 'images/comentario5.webp',
        text: 'Totalmente, a mi hijo también le está sirviendo. Hace casi un mes que la profesora no me manda notas rojas por falta de concentración 🙏',
        likes: 8,
        time: '30 m'
      },
      {
        id: 'seed-1-1',
        name: 'Ana V.',
        img: 'images/comentario6.webp',
        text: 'Yo estaba harta de que dijeran que "es muy distraído". En la última reunión, la tutora me preguntó qué estábamos haciendo en casa porque lo nota mucho más participativo. Qué alivio',
        likes: 15,
        time: '1 h'
      }
    ]
  },
  {
    id: 'seed-2',
    name: 'Fernando Vasquez',
    img: 'images/comentario7.webp',
    text: 'Habíamos probado de todo. Profesores particulares, vitaminas, terapias... dinero a la basura. Pensé que esto sería más de lo mismo. Pero el método del Dr. Turbay hizo un clic en su cerebro. Pasamos de casi perder el año, a que la semana pasada lo llamaran en la asamblea del colegio... ¡para entregarle la medalla al mérito académico! Si tu hijo sufre estudiando, dale una oportunidad a este video',
    likes: 22,
    time: '4 h',
    replies: [
      {
        id: 'seed-2-0',
        name: 'Roberto Martinez',
        img: 'images/comentario8.webp',
        text: 'Yo igual que Fernando. Sentía que mi hijo se iba a quedar atrás para siempre. Hoy es el que ayuda a sus compañeros con las tareas. Verlo tan seguro de sí mismo vale cada segundo de esta presentación.',
        likes: 15,
        time: '1 h'
      }
    ]
  },
  {
    id: 'seed-3',
    name: 'Olivia O.',
    img: 'images/comentario9.webp',
    text: 'Ver a mi hijo llorar diciendo "soy bruto, mamá, no entiendo" me destrozaba el corazón. Este video fue un salvavidas. El Dr. Turbay te explica exactamente qué falla y cómo solucionarlo. Hoy lo vi sentarse a hacer sus deberes solo, sin que yo se lo pidiera, y diciéndome "estaba fácil". Esa seguridad que recuperó no tiene precio. No cierren la página, esta información vale oro.',
    likes: 13,
    time: '12 h',
    replies: []
  }
];

/* ============================================================
   Persistencia local (localStorage) — privada del navegador del lead
   ============================================================ */
var LS_KEYS = {
  NAME: 'vsl_commenter_name',
  COMMENTS: 'vsl_user_comments',
  LIKES: 'vsl_liked_comments'
};

function loadUserComments() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.COMMENTS)) || [];
  } catch (e) {
    return [];
  }
}

function saveUserComments(list) {
  localStorage.setItem(LS_KEYS.COMMENTS, JSON.stringify(list));
}

function loadLikedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_KEYS.LIKES)) || []);
  } catch (e) {
    return new Set();
  }
}

function saveLikedIds(set) {
  localStorage.setItem(LS_KEYS.LIKES, JSON.stringify(Array.from(set)));
}

function loadSavedName() {
  return localStorage.getItem(LS_KEYS.NAME) || '';
}

function saveName(name) {
  localStorage.setItem(LS_KEYS.NAME, name);
}

function generateId() {
  return 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function timeAgo(timestamp) {
  var diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'Ahora mismo';
  if (diff < 3600) return Math.floor(diff / 60) + ' m';
  if (diff < 86400) return Math.floor(diff / 3600) + ' h';
  return Math.floor(diff / 86400) + ' d';
}

/* ============================================================
   Estado en memoria
   ============================================================ */
var likedIds = loadLikedIds();

/* ============================================================
   Construcción de nodos de comentario
   ============================================================ */
function buildAvatar(img) {
  if (img) {
    var el = document.createElement('img');
    el.className = 'avatar';
    el.src = img;
    el.alt = '';
    el.loading = 'lazy';
    return el;
  }
  var el = document.createElement('div');
  el.className = 'avatar avatar-generic';
  el.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#8a8d91"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z"/></svg>';
  return el;
}

function buildMetaRow(id, likesBase, timeLabel) {
  var meta = document.createElement('div');
  meta.className = 'comment-meta';

  var liked = likedIds.has(id);
  var displayLikes = likesBase + (liked ? 1 : 0);

  meta.innerHTML =
    '<button type="button" class="meta-link like-toggle' + (liked ? ' liked' : '') + '" data-id="' + id + '" data-base="' + likesBase + '" data-liked="' + liked + '">Me gusta</button>' +
    '<span>·</span>' +
    '<button type="button" class="meta-link reply-btn" data-id="' + id + '">Responder</button>' +
    '<span>·</span>' +
    '<span class="like-badge">' +
      '<span class="like-icon"><svg viewBox="0 0 24 24" fill="#fff"><path d="M2 21h4V9H2v12zM22 10c0-1.1-.9-2-2-2h-6.3l.9-4.4V3.5C14.4 2.7 13.7 2 12.9 2c-.5 0-1 .2-1.3.6L7 9v12h11c.8 0 1.5-.5 1.8-1.2l3-7c.1-.3.2-.5.2-.8v-2z"/></svg></span>' +
      '<span class="like-count">' + displayLikes + '</span>' +
    '</span>' +
    '<span>·</span>' +
    '<span class="meta-time">' + timeLabel + '</span>';

  return meta;
}

function buildCommentNode(item, isReply, threadId) {
  var wrapper = document.createElement('div');
  wrapper.className = 'comment' + (isReply ? ' reply' : '');
  wrapper.dataset.threadId = threadId;

  wrapper.appendChild(buildAvatar(item.img));

  var body = document.createElement('div');
  body.className = 'comment-body';

  var bubble = document.createElement('div');
  bubble.className = 'comment-bubble';
  var nameSpan = document.createElement('span');
  nameSpan.className = 'comment-name';
  nameSpan.textContent = item.name;
  if (item.isOwn) {
    var badge = document.createElement('span');
    badge.className = 'badge-you';
    badge.textContent = 'Tú';
    nameSpan.appendChild(badge);
  }
  var textSpan = document.createElement('span');
  textSpan.className = 'comment-text';
  textSpan.textContent = item.text;

  bubble.appendChild(nameSpan);
  bubble.appendChild(textSpan);

  var timeLabel = item.createdAt ? timeAgo(item.createdAt) : item.time;

  body.appendChild(bubble);
  body.appendChild(buildMetaRow(item.id, item.likes, timeLabel));

  if (!isReply) {
    var repliesWrap = document.createElement('div');
    repliesWrap.className = 'replies';
    repliesWrap.id = 'replies-' + item.id;
    body.appendChild(repliesWrap);
  }

  wrapper.appendChild(body);
  return wrapper;
}

/* ============================================================
   Render principal
   ============================================================ */
function initComments() {
  var list = document.getElementById('commentsList');
  if (!list) return;

  var userComments = loadUserComments();

  // Agrupa respuestas de usuario por hilo (threadId)
  var userRepliesByThread = {};
  var userTopLevel = [];
  userComments.forEach(function (c) {
    if (c.threadId === c.id) {
      userTopLevel.push(c);
    } else {
      (userRepliesByThread[c.threadId] = userRepliesByThread[c.threadId] || []).push(c);
    }
  });

  SEED_COMMENTS.forEach(function (comment) {
    var node = buildCommentNode(comment, false, comment.id);
    list.appendChild(node);

    var repliesContainer = node.querySelector('#replies-' + comment.id);
    comment.replies.forEach(function (reply) {
      repliesContainer.appendChild(buildCommentNode(reply, true, comment.id));
    });

    var extraReplies = userRepliesByThread[comment.id] || [];
    extraReplies.forEach(function (reply) {
      repliesContainer.appendChild(buildCommentNode(reply, true, comment.id));
    });
  });

  userTopLevel.forEach(function (comment) {
    var node = buildCommentNode(comment, false, comment.id);
    list.appendChild(node);

    var repliesContainer = node.querySelector('#replies-' + comment.id);
    var extraReplies = userRepliesByThread[comment.id] || [];
    extraReplies.forEach(function (reply) {
      repliesContainer.appendChild(buildCommentNode(reply, true, comment.id));
    });
  });

  bindCommentEvents(list);
  bindNewCommentForm();
}

/* ============================================================
   Interacción: me gusta / responder
   ============================================================ */
function bindCommentEvents(list) {
  list.addEventListener('click', function (e) {
    var likeBtn = e.target.closest('.like-toggle');
    if (likeBtn) {
      toggleLike(likeBtn);
      return;
    }

    var replyBtn = e.target.closest('.reply-btn');
    if (replyBtn) {
      toggleReplyForm(replyBtn);
    }
  });
}

function toggleLike(btn) {
  var id = btn.dataset.id;
  var base = parseInt(btn.dataset.base, 10);
  var liked = likedIds.has(id);

  if (liked) {
    likedIds.delete(id);
  } else {
    likedIds.add(id);
  }
  saveLikedIds(likedIds);

  var nowLiked = !liked;
  btn.dataset.liked = nowLiked;
  btn.classList.toggle('liked', nowLiked);

  var countEl = btn.closest('.comment-meta').querySelector('.like-count');
  countEl.textContent = base + (nowLiked ? 1 : 0);
}

function toggleReplyForm(btn) {
  var existing = document.querySelector('.reply-form');
  var commentEl = btn.closest('.comment');
  var threadId = commentEl.dataset.threadId;

  if (existing) {
    var wasForSameComment = existing.dataset.parentComment === btn.dataset.id;
    existing.remove();
    if (wasForSameComment) return;
  }

  var body = btn.closest('.comment-body');
  var form = document.createElement('div');
  form.className = 'reply-form';
  form.dataset.parentComment = btn.dataset.id;
  form.dataset.threadId = threadId;

  form.appendChild(buildAvatar(null));

  var formInner = document.createElement('div');
  formInner.className = 'add-comment-form';
  formInner.innerHTML =
    '<input type="text" class="name-input reply-name-input" placeholder="Tu nombre (opcional)" maxlength="40" value="' + escapeHtml(loadSavedName()) + '">' +
    '<div class="add-comment-input-row">' +
      '<input type="text" class="comment-input reply-text-input" placeholder="Escribe una respuesta...">' +
      '<button type="button" class="send-btn reply-send-btn" aria-label="Publicar respuesta">' +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="#1877f2"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>' +
      '</button>' +
    '</div>';

  form.appendChild(formInner);
  body.appendChild(form);

  var textInput = form.querySelector('.reply-text-input');
  var sendBtn = form.querySelector('.reply-send-btn');

  textInput.addEventListener('input', function () {
    sendBtn.classList.toggle('active', textInput.value.trim().length > 0);
  });

  textInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submitReply(form);
  });

  sendBtn.addEventListener('click', function () {
    submitReply(form);
  });

  textInput.focus();
}

function submitReply(form) {
  var textInput = form.querySelector('.reply-text-input');
  var nameInput = form.querySelector('.reply-name-input');
  var text = textInput.value.trim();
  if (!text) return;

  var name = nameInput.value.trim() || loadSavedName() || 'Tú';
  saveName(name);

  var threadId = form.dataset.threadId;
  var reply = {
    id: generateId(),
    threadId: threadId,
    name: name,
    text: text,
    likes: 0,
    createdAt: Date.now(),
    isOwn: true,
    img: null
  };

  var userComments = loadUserComments();
  userComments.push(reply);
  saveUserComments(userComments);

  var repliesContainer = document.getElementById('replies-' + threadId);
  repliesContainer.appendChild(buildCommentNode(reply, true, threadId));

  form.remove();
}

/* ============================================================
   Nuevo comentario (nivel superior)
   ============================================================ */
function bindNewCommentForm() {
  var nameInput = document.getElementById('commenterName');
  var textInput = document.getElementById('newCommentText');
  var sendBtn = document.getElementById('submitComment');

  nameInput.value = loadSavedName();

  textInput.addEventListener('input', function () {
    sendBtn.classList.toggle('active', textInput.value.trim().length > 0);
  });

  textInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submitNewComment(nameInput, textInput);
  });

  sendBtn.addEventListener('click', function () {
    submitNewComment(nameInput, textInput);
  });
}

function submitNewComment(nameInput, textInput) {
  var text = textInput.value.trim();
  if (!text) return;

  var name = nameInput.value.trim() || loadSavedName() || 'Tú';
  saveName(name);
  nameInput.value = name;

  var id = generateId();
  var comment = {
    id: id,
    threadId: id,
    name: name,
    text: text,
    likes: 0,
    createdAt: Date.now(),
    isOwn: true,
    img: null
  };

  var userComments = loadUserComments();
  userComments.push(comment);
  saveUserComments(userComments);

  var list = document.getElementById('commentsList');
  list.appendChild(buildCommentNode(comment, false, id));

  textInput.value = '';
  document.getElementById('submitComment').classList.remove('active');
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
