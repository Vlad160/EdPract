
var articleRenderer = (function () {
    var ARTICLE_TEMPLATE_BIG;
    var ARTICLE_LIST_NODE_TOP;
    var ARTICLE_TEMPLATE_SMALL;
    var ARTICLE_LIST_NODE_BOT;
    const MAX_ARTICLES_TOP = 3;
    const MAX_ARTICLES_BOT = 6;

    function init() {

        ARTICLE_TEMPLATE_BIG = document.querySelector('#template-article-top');
        ARTICLE_LIST_NODE_TOP = document.querySelector('.top-news-bar');
        ARTICLE_TEMPLATE_SMALL = document.querySelector('#template-article-bot');
        ARTICLE_LIST_NODE_BOT = document.querySelector('.bottom-news');
    }

    function showUserElements() {
        var editButtons = document.getElementsByClassName('edit-panel');
        var button = document.getElementById('add-button');
        var user = document.querySelector('.login');
        if (userService.getUsername().length == 0) {
            user.innerHTML = "Вход";
            button.style.visibility = "hidden";

            [].forEach.call(editButtons, function (item) {
                item.style.visibility = "hidden"
            });
            button.style.visibility = "hidden";
            ARTICLE_TEMPLATE_BIG.content.querySelector('.edit-panel').style.visibility = "hidden";
            ARTICLE_TEMPLATE_SMALL.content.querySelector('.edit-panel').style.visibility = "hidden";
        }
        if (userService.getUsername().length != 0) {
            user.innerHTML = "Привет, " + userService.getUsername();
            [].forEach.call(editButtons, function (item) {
                item.style.visibility = "visible"
            });
            button.style.visibility = "visible";
            ARTICLE_TEMPLATE_BIG.content.querySelector('.edit-panel').style.visibility = "visible";
            ARTICLE_TEMPLATE_SMALL.content.querySelector('.edit-panel').style.visibility = "visible";
        }
    }

    function insertArticlesInDOM(articles, place) {
        if (place.toLowerCase() == 'top') {
            var articlesNodesTop = renderArticles(articles, 'top');
            articlesNodesTop.forEach(function (node) {
                ARTICLE_LIST_NODE_TOP.appendChild(node);
            });
        }

        if (place.toLowerCase() == 'bot') {
            var articlesNodesBot = renderArticles(articles, 'bot');

            articlesNodesBot.forEach(function (node) {
                ARTICLE_LIST_NODE_BOT.appendChild(node);
            });
        }

    }

    function insertArticleInDOM(article, place) {
        if (place.toLowerCase() == 'top') {
            var articlesNodeTop = renderArticle(article, 'top');
            if (ARTICLE_LIST_NODE_TOP.children.length < MAX_ARTICLES_TOP) {
                ARTICLE_LIST_NODE_TOP.insertBefore(articlesNodeTop, ARTICLE_LIST_NODE_TOP.firstChild);
            }
            else {
                ARTICLE_LIST_NODE_TOP.removeChild(ARTICLE_LIST_NODE_TOP.lastChild);
                ARTICLE_LIST_NODE_TOP.insertBefore(articlesNodeTop, ARTICLE_LIST_NODE_TOP.firstChild);
            }
        }

        if (place.toLowerCase() == 'bot') {
            var articlesNodeBot = renderArticle(article, 'bot');
            if (ARTICLE_LIST_NODE_BOT.children <= MAX_ARTICLES_BOT) {
                ARTICLE_LIST_NODE_BOT.insertBefore(articlesNodeBot, ARTICLE_LIST_NODE_BOT.firstChild);
            }
            else {
                ARTICLE_LIST_NODE_BOT.removeChild(ARTICLE_LIST_NODE_BOT.lastChild);
                ARTICLE_LIST_NODE_BOT.insertBefore(articlesNodeBot, ARTICLE_LIST_NODE_BOT.firstChild);
            }
        }
    }

    function removeArticlesFromDom(place) {
        if (!place) {
            ARTICLE_LIST_NODE_TOP.innerHTML = '';
            ARTICLE_LIST_NODE_BOT.innerHTML = '';
        }
        if (place === 'top') {
            ARTICLE_LIST_NODE_TOP.innerHTML = '';
        }
        if (place === 'bot') {
            ARTICLE_LIST_NODE_BOT.innerHTML = '';
        }
    }

    function findNodeByID(Node, id) {
        var searchIndex = -1;
        [].forEach.call(Node.children, function (child, i) {
            if (child.getAttribute('data-id') === id) {
                searchIndex = i;
            }
        });
        return searchIndex;

    }

    function removeArticlesFromDomByID(id) {
        var idx = findNodeByID(ARTICLE_LIST_NODE_TOP, id);
        if (idx != -1) {
            ARTICLE_LIST_NODE_TOP.removeChild(ARTICLE_LIST_NODE_TOP.children[idx]);
        }
        var idx = findNodeByID(ARTICLE_LIST_NODE_BOT, id);
        if (idx != -1) {
            ARTICLE_LIST_NODE_BOT.removeChild(ARTICLE_LIST_NODE_BOT.children[idx]);
        }
    }

    function editByID(id, article) {
        articlesService.editArticle(id, article);
        var idx = findNodeByID(ARTICLE_LIST_NODE_TOP, id);

        if (idx != -1) {
            var insert = renderArticle(articlesService.getArticle(id), 'top');
            ARTICLE_LIST_NODE_TOP.replaceChild(insert, ARTICLE_LIST_NODE_TOP.children[idx]);
        }
        var idx = findNodeByID(ARTICLE_LIST_NODE_BOT, id);
        if (idx != -1) {
            var insert = renderArticle(articlesService.getArticle(id), 'bot');
            ARTICLE_LIST_NODE_BOT.replaceChild(insert, ARTICLE_LIST_NODE_BOT.children[idx]);
        }
    }

    function renderArticles(articles, place) {
        return articles.map(function (article) {
            return renderArticle(article, place);
        });
    }

    function renderErrorFilter() {
        ARTICLE_LIST_NODE_BOT.innerHTML = "Ничего не найдено";
    }

    function renderArticle(article, place) {

        if (place.toLowerCase() == 'top') {
            var template = ARTICLE_TEMPLATE_BIG;
            template.content.querySelector('.top-news-wrapper').dataset.id = article.id;
            template.content.querySelector('.news-header-big').innerHTML = "<h5>" + article.title + "</h5>";
            template.content.querySelector('.news-preview-big').innerHTML = "<p>" + article.summary + "</p>";
            template.content.querySelector('.news-big-author').textContent = article.author;
            template.content.querySelector('.news-big-date').textContent = formatDate(article.createdAt);
            template.content.getElementById('big-image').src = article.picture;
            template.content.querySelector('.news-tag').textContent = article.tags[0];

            return template.content.querySelector('.top-news-wrapper').cloneNode(true);
        }
        if (place.toLowerCase() == 'bot') {
            var template = ARTICLE_TEMPLATE_SMALL;
            template.content.querySelector('.bottom-news-wrapper').dataset.id = article.id;
            template.content.querySelector('.news-header-small').innerHTML = "<a><h5>" + article.title + "</h5></a>";
            template.content.querySelector('.news-preview-small').innerHTML = "<p>" + article.summary + "</p>";
            var smallInfo = template.content.querySelector('.news-info-small').getElementsByTagName('span');
            smallInfo[0].textContent = article.tags;
            smallInfo[1].textContent = formatDate(article.createdAt);
            smallInfo[2].textContent = article.author;
            template.content.getElementById('small-image').src = article.picture;
            return template.content.querySelector('.bottom-news-wrapper').cloneNode(true);
        }
    }

    function formatDate(d) {
        return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' +
            d.getHours() + ':' + d.getMinutes();
    }

    return {
        init: init,
        insertArticlesInDOM: insertArticlesInDOM,
        removeArticlesFromDom: removeArticlesFromDom,
        removeArticlesFromDomByID: removeArticlesFromDomByID,
        editByID: editByID,
        showUserElements: showUserElements,
        formatDate: formatDate,
        insertArticleInDOM: insertArticleInDOM,
        renderArticle: renderArticle,
        renderErrorFilter: renderErrorFilter
    }
}());

var pagination = (function () {
    var ITEMS_PER_PAGE = 6;
    var total;
    var currentPage;
    var showMoreButton;
    var showMoreCallback;

    function init(_total, _showMoreCallback) {
        currentPage = 1;
        total = _total;
        showMoreCallback = _showMoreCallback;
        showMoreButton = document.querySelector('.more-news');
        showMoreButton.addEventListener('click', handleShowMoreClick);


        showOrHideMoreButton();


        return getParams();
    }

    function handleShowMoreClick() {
        var paginationParams = nextPage();
        showMoreCallback(paginationParams.skip, paginationParams.top);
    }

    function getTotalPages() {
        return Math.ceil(total / ITEMS_PER_PAGE);
    }

    function nextPage() {
        currentPage = currentPage + 1;

        showOrHideMoreButton();

        return getParams();
    }

    function getParams() {
        return {
            top: ITEMS_PER_PAGE,
            skip: (currentPage - 1) * ITEMS_PER_PAGE
        };
    }

    function showOrHideMoreButton() {
        if (getTotalPages() <= currentPage) {
            showMoreButton.style.display = "none";
        }
        else {
            showMoreButton.style.display = "block";
        }
    }

    return {
        init: init
    }

}());

var fullNewsService = (function () {
    var TEMPLATE_FULL;
    var TOP_NEWS_CONTAINER;
    var BOTTOM_NEWS_CONTAINER;
    var TEMPLATE_FULL_BACKGROUND;
    var TEMPLATE_EDIT_ADD;
    var ADD_NEWS_BUTTON;
    var contentArea;
    var submitButton;
    var maxHeight = 400;
    var EDIT_ID;
    var articleToAdd;
    var TAGS_EDIT;

    function init() {
        TEMPLATE_FULL = document.getElementById('template-full-news');
        TOP_NEWS_CONTAINER = document.querySelector('.top-news-bar');
        BOTTOM_NEWS_CONTAINER = document.querySelector('.bottom-news-bar');
        TOP_NEWS_CONTAINER.addEventListener('click', handleShowClick);
        BOTTOM_NEWS_CONTAINER.addEventListener('click', handleShowClick);
        TEMPLATE_EDIT_ADD = document.getElementById('template-add-edit-news');
        ADD_NEWS_BUTTON = document.getElementById('add-button');
        ADD_NEWS_BUTTON.addEventListener('click', handleAddNewsClick);

    }

    function handleShowClick(event) {
        var target = event.target;
        if (target.type === 'button') {
            openFullNews(target);
            waitForClose();
        }
        if (target.className === 'delete-news') {
            deleteNews(target);
        }
        if (target.className === 'edit-news') {
            editNews(target);
        }
        if (target.tagName.toLocaleLowerCase() === 'h5') {
            openFullNews(target);
            waitForClose();
        }
    }

    /*Full News*/

    function openFullNews(node) {
        while (!node.hasAttribute('data-id')) {
            node = node.parentNode;
        }
        var id = node.getAttribute('data-id');
        document.body.appendChild(renderFullNews(id));
    }

    function waitForClose() {
        TEMPLATE_FULL_BACKGROUND = document.querySelector('.news-background');
        TEMPLATE_FULL_BACKGROUND.addEventListener('click', handleCloseFull);
    }

    function handleCloseFull(event) {
        if (event.target != TEMPLATE_FULL_BACKGROUND)return;
        TEMPLATE_FULL_BACKGROUND.remove();
    }

    function renderFullNews(id) {
        var article = articlesService.getArticle(id);
        var template = TEMPLATE_FULL;
        template.content.querySelector('.top-image-full').style.backgroundImage = "url(" + article.picture + ")";
        template.content.querySelector('.full-left').innerHTML = article.author;
        var description = template.content.querySelector('.description-full').getElementsByTagName('span');
        description[1].innerHTML = articleRenderer.formatDate(article.createdAt);
        description[2].innerHTML = article.tags.toString();
        template.content.querySelector('.title-full').innerHTML = "<h5>" + article.title + "</h5>";
        template.content.querySelector('.content-full').textContent = article.content;
        return template.content.querySelector('.news-background').cloneNode(true);
    }

    /*Edit News*/
    function editNews(node) {
        while (!node.hasAttribute('data-id')) {
            node = node.parentNode;
        }
        EDIT_ID = node.getAttribute('data-id');
        openEditAdd(EDIT_ID);
        TAGS_EDIT = customInput().init(articlesService.getTags(), 'add-edit-tags', true);
        TAGS_EDIT.setSelected(articlesService.getArticle(EDIT_ID).tags);
        removeAddEditForm();
        contentArea = document.getElementById('add-content-field');
        contentArea.addEventListener('keydown', handleContentResize);
        submitButton = document.getElementById('add-news-submit');
        submitButton.addEventListener('click', handleSubmitNews);
    }

    function handleSubmitNews() {
        if (validateAddFrom()) {
            articleRenderer.editByID(EDIT_ID, articleToAdd);
            TEMPLATE_FULL_BACKGROUND.remove();
        }
        else {
            document.querySelector('.add-edit-news-invalid').style.visibility = 'visible';
        }
    }

    function validateAddFrom() {
        articleToAdd = collectData();
        return articlesService.validateArticle(articleToAdd);
    }

    function collectData() {
        var addArticle = {};
        var form = document.forms.addNewsForm;
        addArticle['picture'] = form.elements[0].value;
        addArticle['title'] = form.elements[1].value;
        addArticle['summary'] = form.elements[2].value;
        addArticle['content'] = form.elements[3].value;
        addArticle['tags'] = TAGS_EDIT.getSelected();
        var newTags = TAGS_EDIT.getNew();
        if (newTags.length > 0) {
            newTags.forEach(function (item) {
                articlesService.addTag(item);
            })
        }
        return addArticle;
    }

    function openEditAdd(id) {
        document.body.appendChild(renderAddEditNews(id));
    }

    function renderAddEditNews(id) {
        var template = TEMPLATE_EDIT_ADD;
        if (!id) {
            return template.content.querySelector('.news-background').cloneNode(true);
        }
        if (id) {
            var article = articlesService.getArticle(id);
            var form = template.content.querySelector('.add-edit-news-form');
            form.elements[0].value = article.picture;
            form.elements[1].value = article.title;
            form.elements[2].value = article.summary;
            form.elements[3].value = article.content;
            form.elements[3].style.height = maxHeight.toString() + 'px';
            return template.content.querySelector('.news-background').cloneNode(true);
        }
    }

    function removeAddEditForm() {
        TEMPLATE_FULL_BACKGROUND = document.querySelector('.news-background');
        TEMPLATE_FULL_BACKGROUND.addEventListener('click', handleRemoveAddEdit);
    }

    function handleRemoveAddEdit(event) {
        if (event.target != TEMPLATE_FULL_BACKGROUND)return;
        var child = event.target;
        child = child.children[0];
        var isRemove = true;
        if (child.className === 'add-edit-news-wrapper') {
            isRemove = confirm('Отменить создание?')
        }
        if (isRemove) {
            clearForms();
            TEMPLATE_FULL_BACKGROUND.remove();
        }
    }

    /*Add News*/
    function handleAddNewsClick() {
        openEditAdd();
        clearForms();
        removeAddEditForm();
        addNews();
    }

    function addNews() {
        contentArea = document.getElementById('add-content-field');
        contentArea.addEventListener('keydown', handleContentResize);
        submitButton = document.getElementById('add-news-submit');
        submitButton.addEventListener('click', handleAddNewsSubmit);
        TAGS_EDIT = customInput().init(articlesService.getTags(), 'add-edit-tags', true);
    }

    function handleContentResize() {
        function resize() {

            if (contentArea.scrollHeight > maxHeight) {
                contentArea.style.height = maxHeight.toString() + 'px';
            }
            else {
                contentArea.style.height = 'auto';
                contentArea.style.height = contentArea.scrollHeight + 'px';
            }
        }

        function delayedResize() {
            window.setTimeout(resize, 0);
        }

        contentArea.focus();
        if (contentArea.offsetHeight < maxHeight) {
            resize();
        }
    }

    function handleAddNewsSubmit() {
        var article = collectData();
        if (articlesService.validateArticle(article)) {
            articlesService.addArticle(article);
            renderPagination(filter.getFilterConfig(),articlesService.getArticlesCount(filter.getFilterConfig()));
            TEMPLATE_FULL_BACKGROUND.remove();
            filter.fillFilter();
        }
        else {
            document.querySelector('.add-edit-news-invalid').style.visibility = 'visible';
        }
    }

    /*Delete News*/
    function deleteNews(node) {
        while (!node.hasAttribute('data-id')) {
            node = node.parentNode;
        }
        var id = node.getAttribute('data-id');
        articleRenderer.removeArticlesFromDomByID(id);
        articlesService.removeArticle(id);
        articleRenderer.removeArticlesFromDom();
        renderArticles(0, 3, undefined, 'top');
        renderPagination(undefined, articlesService.getArticlesSize());
    }

    function clearForms() {
        var form = document.forms.addNewsForm;
        form.elements[0].value = "";
        form.elements[1].value = "";
        form.elements[2].value = "";
        form.elements[3].value = "";
    }


    return {
        init: init,
        renderFullNews: renderFullNews,
    }

}());

var userService = (function () {
    var USER_STATUS = false;
    var CURRENT_USER = {
        login: '',
        username: '',
        password: ''
    };
    var USER_BASE = [{
        login: 'admin',
        username: 'Цаль Виталий',
        password: 'admin'
    }];
    var LOGIN_BUTTON_FORM;
    var LOGIN_FORM;
    var LOGIN_BUTTON;

    function init() {
        LOGIN_BUTTON_FORM = document.querySelector('.top-bar-login');
        LOGIN_BUTTON_FORM.addEventListener('click', handleClickLoginButton);
        LOGIN_FORM = document.querySelector('.login-form-wrapper');
        LOGIN_FORM.style.display = 'none';
        LOGIN_BUTTON = document.getElementById('login-button');
        LOGIN_BUTTON.addEventListener('click', handleClickLogin);              //проверка существования пользователя
    }

    function handleClickLoginButton(event) {
        var target = event.currentTarget;
        if (target != this) return;
        if (getUsername().length === 0) {
            LOGIN_FORM.style.display = (LOGIN_FORM.style.display === 'none') ? 'block' : 'none';
        }
        if (getUsername().length > 0) {
            var isRemove = confirm('Выйти?');
            if (isRemove) {
                CURRENT_USER = {
                    login: '',
                    username: '',
                    password: ''
                };
                articleRenderer.showUserElements();
            }
        }
    }

    function handleClickLogin(event) {
        var target = event.target;
        if (target.type !== 'button') return;
        if (target.id === 'login-button') {
            var data = collectData();
            if (validateUser(data[0], data[1])) {
                USER_STATUS = true;
                articleRenderer.showUserElements();
                LOGIN_FORM.style.display = 'none';
                clearForm();
            }
            else {
                alert('Неверное имя пользователя или пароль');
            }
        }
    }

    function getUserStatus() {
        return USER_STATUS;
    }

    function getUsername() {
        return CURRENT_USER.username;
    }

    function collectData() {
        var form = document.getElementById('login-form');
        var data = [];
        data.push(form.elements[0].value);
        data.push(form.elements[1].value);
        return data;

    }

    function clearForm() {
        var form = document.getElementById('login-form');
        form.elements[0].value = "";
        form.elements[1].value = "";
    }

    function validateUser(login, password) {
        let findUser = USER_BASE.find(function (item) {
            return item.login === login;
        });
        if (findUser) {
            if (findUser.password === password) {
                USER_STATUS = true;
                CURRENT_USER = findUser;
                return true;
            }
        }
        return false;
    }

    return {
        init: init,
        getUserStatus: getUserStatus,
        getUsername: getUsername
    }
}());

var filter = (function () {
    var form;
    var submitButton;
    var tagsFilter;
    var authorFilter;

    function init() {
        form = document.forms.filter;
        submitButton = form.elements.filterButton;
        submitButton.addEventListener('click', handleSubmitClick);
        tagsFilter = customInput().init(articlesService.getTags(), 'tags-filter');
        authorFilter = customInput().init(articlesService.getAuthors(), 'author-filter');
        return getFilter();
    }

    function getFilter() {
        var filterConfig = {};
        /* Тут происходит сбор всех фильтров: АВТОР + ДАТА + ТЕГИ. Потом этот объект передадим в функцию getArticles как fitlerConfig */
        if (authorFilter.getSelected().length != 0) {
            filterConfig['author'] = authorFilter.getSelected();
        }
        if (tagsFilter.getSelected().length != 0) {
            filterConfig['tags'] = tagsFilter.getSelected();
        }
        var dateFrom = form.elements.date_from;
        if (dateFrom.value) {
            filterConfig['createdAtFrom'] = new Date(dateFrom.value);
        }
        var dateTo = form.elements.date_to;
        if (dateTo.value) {
            filterConfig['createdAtTo'] = new Date(dateTo.value);
        }
        return filterConfig;
    }

    function fillFilter() {
        tagsFilter.reload(articlesService.getTags());
        authorFilter.reload(articlesService.getAuthors());
    }

    function handleSubmitClick() {
        var filter = getFilter();
        if (Object.keys(filter).length !== 0) {
            articleRenderer.removeArticlesFromDom();
            var total = articlesService.getArticlesCount(filter);
            if (total === 0) {
                articleRenderer.renderErrorFilter();
            }
            renderPagination(filter, total);
        }
        else {
            articleRenderer.removeArticlesFromDom();
            renderArticles(0, 3, undefined, 'top');
            var total = articlesService.getArticlesSize();
            renderPagination(undefined, total);
        }
    }

    return {
        init: init,
        getFilterConfig: getFilter,
        fillFilter: fillFilter,
    };

}());
document.addEventListener('DOMContentLoaded', startApp);


function startApp() {
    articlesService.getArticlesFromServer();
    articleRenderer.init();
    var total = articlesService.getArticlesSize();
    renderPagination(undefined, total);
    fullNewsService.init();
    articleRenderer.showUserElements();
    userService.init();
    filter.init();
}
function renderArticles(skip, top, filterConfig, place) {
    var articlesTop = articlesService.getArticles(skip, top, filterConfig);
    articleRenderer.insertArticlesInDOM(articlesTop, place);
}
function renderPagination(filter, total) {
    articleRenderer.removeArticlesFromDom();
    var paginationParams = pagination.init(total, function (skip, top) {
        renderArticles(skip, top, filter, 'bot');
    });
    renderArticles(paginationParams.skip, paginationParams.top, filter, 'bot');
    if (filter === undefined) {
        renderArticles(0, 3, undefined, 'top');
    }
}