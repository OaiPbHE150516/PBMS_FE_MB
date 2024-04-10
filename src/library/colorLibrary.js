const colorLibrary = {
  // Get a random color from the data array
  getRandomColor: () => {
    return data[Math.floor(Math.random() * data.length)];
  },
  // lấy ra một mã màu hex ngẫu nhiên từ thuật toán Math.random
  getRandomHexColor: () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  },
  // get color by index
  getColorByIndex: (index) => {
    return data[index];
  },
  // return random index in range 1 to half of data length
  getRandomIndex: () => {
    return Math.floor(Math.random() * data.length / 2);
  },
};

const data = [
  "#f7ad0d",
  "#ff7675",
  "#00b894",
  "#6ec25a",
  "#ffa8ba",
  "#197da5",
  "#8f5f52",
  "#414572",
  "#6ec25a",
  "#bd71aa",
  "#d1ffee",
  "#1c86a7",
  "#ffcd1d",
  "#1d58a7",
  "#ff5f05",
  "#c8c6c7",
  "#33b34d",
  "#FFDAB9", // Màu da
  "#FFD700", // Màu vàng nghệ
  "#556B2F", // Màu xanh rêu
  "#8B4513", // Màu đậu đỏ
  "#D2B48C", // Màu đá cẩm thạch
  "#808000", // Màu dừa
  "#A52A2A", // Màu cà phê
  "#FF6666", // Đỏ nhạt
  "#66FF66", // Xanh lá cây nhạt
  "#6666FF", // Xanh dương nhạt
  "#66FFFF", // Xanh da trời nhạt
  "#FF66FF", // Tím nhạt
  "#FFCC66", // Cam nhạt
  "#CC66CC", // Màu tứ quý nhạt
  "#66CCCC", // Xanh lam nhạt
  "#CCCC66", // Màu dừa nhạt
  "#CC6666", // Nâu đỏ nhạt
  "#66CC66", // Xanh lá nhạt
  "#6666CC", // Xanh đậm nhạt
  "#CC66CC", // Màu tứ quý nhạt
  "#66CCCC", // Xanh lam nhạt
  "#CCCC66", // Màu dừa nhạt
  "#CC6666", // Nâu đỏ nhạt
  "#66CC66", // Xanh lá nhạt
  "#6666CC", // Xanh đậm nhạt
  "#CC66CC", // Màu tứ quý nhạt
  "#66CCCC", // Xanh lam nhạt
  "#CCCC66", // Màu dừa nhạt
  "#CC6666", // Nâu đỏ nhạt
  "#66CC66", // Xanh lá nhạt
  "#6666CC", // Xanh đậm nhạt
  "#CC66CC", // Màu tứ quý nhạt
  "#66CCCC", // Xanh lam nhạt
  "#CCCC66", // Màu dừa nhạt
  "#CC6666", // Nâu đỏ nhạt
];

export default colorLibrary;
