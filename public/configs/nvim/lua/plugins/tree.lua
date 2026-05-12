-- ~/.config/nvim/lua/plugins/tree.lua
return {
  {
    "nvim-tree/nvim-tree.lua",
    dependencies = {
      "nvim-tree/nvim-web-devicons",
    },
    config = function()
      require("nvim-tree").setup({
        view = {
          width = 35,
        },

        renderer = {
          group_empty = true,
        },

        filters = {
          dotfiles = false,
        },

        git = {
          enable = true,
        },
      })

      vim.keymap.set("n", "<leader>e", ":NvimTreeToggle<CR>")
    end,
  },
}
