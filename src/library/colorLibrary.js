const colorLibrary = {
  // Get a random color from the data array
  getRandomColor: () => {
    return data[Math.floor(Math.random() * data.length)];
  },
  // lấy ra một mã màu hex ngẫu nhiên từ thuật toán Math.random
  getRandomHexColor: () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
};

const data = [
  "#FF0000", // Đỏ
  "#00FF00", // Xanh lá cây
  "#0000FF", // Xanh dương
  "#FFFF00", // Vàng
  "#00FFFF", // Xanh da trời
  "#FF00FF", // Tím
  "#FFA500", // Cam
  "#FF69B4", // Hồng
  "#808080", // Xám
  "#A52A2A", // Nâu
  "#008000", // Xanh lục
  "#000080", // Xanh lam
  "#FFC0CB", // Hồng nhạt
  "#FFDAB9", // Màu da
  "#D3D3D3", // Màu ghi
  "#C0C0C0", // Màu bạc
  "#FFD700", // Màu vàng nghệ
  "#FFE4E1", // Màu hồng phấn
  "#556B2F", // Màu xanh rêu
  "#8B4513", // Màu đậu đỏ
  "#FFFAFA", // Màu tuyết
  "#FFF8DC", // Màu kem
  "#8B4513", // Màu nâu đất
  "#FFC0CB", // Màu thạch anh hồng
  "#D2B48C", // Màu đá cẩm thạch
  "#808000", // Màu dừa
  "#A52A2A", // Màu cà phê
  "#FF6666", // Đỏ nhạt
  "#66FF66", // Xanh lá cây nhạt
  "#6666FF", // Xanh dương nhạt
  "#FFFF66", // Vàng nhạt
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
  "#FF0000", // Đỏ
  "#00FF00", // Xanh lá cây
  "#0000FF", // Xanh dương
  "#FFFF00", // Vàng
  "#00FFFF", // Xanh da trời
  "#FF00FF", // Tím
  "#FFA500", // Cam
  "#800080", // Màu tứ quý
  "#008080", // Xanh lam
  "#808000", // Màu dừa
  "#800000", // Nâu đỏ
  "#008000", // Xanh lá
  "#000080", // Xanh đậm
  "#800080", // Màu tứ quý
  "#008080", // Xanh lam
  "#808000", // Màu dừa
  "#800000", // Nâu đỏ
  "#008000", // Xanh lá
  "#000080", // Xanh đậm
  "#800080", // Màu tứ quý
  "#008080", // Xanh lam
  "#808000", // Màu dừa
  "#800000", // Nâu đỏ
  "#008000", // Xanh lá
  "#000080", // Xanh đậm
  "#800080", // Màu tứ quý
  "#008080", // Xanh lam
  "#808000", // Màu dừa
  "#800000", // Nâu đỏ
  "#81ff51",
  "#660d6c",
  "10df18",
  "#8472a1",
  "#15ccc9",
  "#fbc3bd",
  "#e84b6d",
  "#e7f944",
  "#fba83a",
  "#8745ab",
  "#f586a2",
  "#6c8269",
  "#4bee81",
  "#2fb36a",
  "#ef5587",
  "#d66879",
  "#b8870a",
  "#8fd6d2",
  "#0d1e97",
  "#7b8e40",
  "#2fb85e",
  "#efde5c",
  "#86c310",
  "#b65141"
];

export default colorLibrary;
