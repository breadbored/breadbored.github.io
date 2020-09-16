const projects = [
	{
		name: "identex",
		description: "A fraud detection engine",
		image: "project-1-cover.png",
		modal: "project-1-modal",
		link: "https://identex.co",
		beta: false,
	},
	{
		name: "Kikkit",
		description: "Association football forum",
		image: "project-2-cover.png",
		modal: "project-2-modal",
		link: "https://kikkit.identex.co",
		beta: true,
	},
	{
		name: "I Heart CBD",
		description: "Store with custom plugins",
		image: "project-3-cover.png",
		modal: "project-3-modal",
		link: "https://westashleyiheartcbd.com",
		beta: false,
	},
	{
		name: "Pressure Them",
		description: "Political website",
		image: "project-4-cover.png",
		modal: "project-4-modal",
		link: "https://pressurethem.com/policebrutality",
		beta: false,
	},
	{
		name: "QuantumRand",
		description: "Quantum RNG library for Python",
		image: "project-5-cover.jpg",
		modal: "project-5-modal",
		link: "https://pypi.org/project/quantumrand/",
		beta: false,
	},
	{
		name: "This portfolio!",
		description: "Written in React/NodeJS",
		image: "project-6-cover.png",
		modal: "project-6-modal",
		link: "#",
		beta: false,
	},
];

export function getProjects() {
  var splitArrays = [];
  for(var i = 0; i < projects.length; i += 3) {
    splitArrays.push(projects.slice(i, i+3));
  }
  return splitArrays;
}