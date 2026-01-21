"use strict";
!(function () {
	for (var n = document.getElementsByTagName("pre"), e = n.length, s = 0; s < e; s++) {
		for (var a = n[s].innerHTML.split(/\n/).length, r = 0; r < a - 1; r++) {
			var firstSpan = n[s].getElementsByTagName("span")[0];
			if (firstSpan) {
				firstSpan.innerHTML += "<span>" + (r + 1) + "</span>";
			}
		}
	}
})();

// 获取目录A标签
let mainNavLinks = document.querySelectorAll(".markdownIt-TOC a");
let container = document.getElementById("post-content-article");
let containerTop = container.offsetTop;

// 遍历Toc，重写点击事件
mainNavLinks.forEach((link, index) => {
	link.name = "TocA-" + link.hash; // 将href对应的url塞入name里
	link.href = "javascript:void(0)"; // 将href置空
	link.onclick = () => {
		let section = document.getElementById(decodeURI(link.name).substring(6));
		let scrollY = section.offsetTop + containerTop - 67;
		// window.scrollTo(0, scrollY);
		window.scrollTo({
			top: scrollY,
			behavior: "smooth",
		});
	};
});

// 监听滚动，设置当前TOC
window.addEventListener("scroll", (event) => {
	let fromTop = window.scrollY;

	mainNavLinks.forEach((link, index) => {
		// name对应的标签
		let section = document.getElementById(decodeURI(link.name).substring(6));
		// 下一个标签
		let nextSection = null;
		if (mainNavLinks[index + 1]) {
			nextSection = document.getElementById(decodeURI(mainNavLinks[index + 1].name).substring(6));
		}
		if (section.offsetTop + containerTop <= fromTop + 67) {
			if (nextSection) {
				if (nextSection.offsetTop + containerTop > fromTop + 67) {
					link.classList.add("currentToc");
				} else {
					link.classList.remove("currentToc");
				}
			} else {
				link.classList.add("currentToc");
			}
		} else {
			link.classList.remove("currentToc");
		}
	});
});

// var list = document.querySelectorAll(".katex");
// for (var i = 0; i < list.length; i++) {
// 	list[i].style.display = "unset";
// }
// var h = document.documentElement,
// 	b = document.body,
// 	st = "scrollTop",
// 	sh = "scrollHeight",
// 	progress = document.querySelector(".progress"),
// 	scroll;
// document.addEventListener("scroll", function () {
// 	if (progress) {
// 		scroll = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
// 		progress.style.setProperty("--scroll", scroll + "%");
// 	}
// });
// var wxScale = new WxScale({ fullPage: document.querySelector("#fullPage"), canvas: document.querySelector("#canvas") });
// var imgBox = document.querySelectorAll("#md_block img");
// for (var i = 0; i < imgBox.length; i++) {
// 	imgBox[i].onclick = function (e) {
// 		wxScale.start(this);
// 	};
// }
// var content = "本文最后更新于<%= post.dateFormat %>，已超过 1 年没有更新，涉及的内容可能已经失效！";
// var date1 = "<%= post.date %>";
// date1 = date1.replace("-", "/");
// var date2 = new Date();
// var date3 = date2.getTime() - new Date(date1).getTime();
// var days = Math.floor(date3 / (24 * 3600 * 1000));
// if (days >= 365) {
// 	document.getElementById("warn").innerHTML = content;
// }
