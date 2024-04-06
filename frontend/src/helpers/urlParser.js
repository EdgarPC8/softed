export default (route) => {
    const regexEmoji = /%([0-9A-Fa-f]{2})/g;
    const regexHash = /#-/g;
    const currentRoute = route.replace(regexEmoji, "").replace(regexHash, "/");
    return currentRoute;
}