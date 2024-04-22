const spacy = require('spacy-nlp');

// Load the small English model
spacy.load('en_core_web_sm').then((nlp) => {
  // Sample text
  const text = "Barack Obama was the 44th President of the United States. He served two terms from 2009 to 2017.";

  // Process the text
  const doc = nlp(text);

  // Extract standalone facts
  const facts = [];
  let prevSubject = null;

  doc.sents.forEach((sent) => {
    let subject = null;
    let verb = null;
    let object = null;

    sent.tokens.forEach((token) => {
      if (token.dep === 'nsubj') {
        subject = token.text;
        prevSubject = subject;
      } else if (token.pos === 'VERB') {
        verb = token.lemma;
      } else if (['dobj', 'pobj', 'attr'].includes(token.dep)) {
        object = token.subtree.map((t) => t.text).join(' ');
      }
    });

    if (verb && object) {
      const fact = subject ? `${subject} ${verb} ${object}` : `${prevSubject} ${verb} ${object}`;
      facts.push(fact);
    }
  });

  // Print the extracted facts
  facts.forEach((fact) => {
    console.log(fact);
  });
}).catch((err) => {
  console.error('Failed to load the spaCy model:', err);
});