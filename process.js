/**
 * Amendements Processing
 * =======================
 *
 * Filtering & cleaning the amendements before actually parsing them.
 */
function clean(txt) {
  return txt
    .replace(/\s/g, ' ')
    .replace(/<\/p><p>/g, ' ')
    .replace(/(<p>|<\/p>)/g, '');
}

module.exports = function(amendements) {
  return amendements
    .map(function(row) {
      row.amendement.texte = clean(row.amendement.texte);
      return row.amendement;
    })
    .filter(function(a) {
      return !(a.sort === "Irrecevable" ||
               a.sort === "Rejeté" ||
               a.sort === "Tombe" ||
               a.sort === "Retiré" ||
               a.sort === "Non soutenu" ||
               a.sujet.match(/^article additionnel/i)) &&
               a.source.match(/assemblee-nationale/) &&
               a.sujet === "article 1er";
    });
};
