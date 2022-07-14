import os


def search_video(path, key='mp4'):
    timelists = []
    key = '.' + key
    sort_num = []
    video_paths = []
    walk_lists = os.walk(path)
    for root, docs, files in walk_lists:
        for file in files:
            if key == os.path.splitext(file)[1]:
                video_path = os.path.join(root, file).replace('\\', '/')
                video_paths.append([video_path, int(os.path.getmtime(video_path))])
                timelists.append(int(os.path.getmtime(video_path)))
    timelists.sort()
    for time_list in timelists:
        for i, video_path in enumerate(video_paths):
            if time_list == video_path[1]:
                sort_num.append(i)
    newpaths = []
    for num in sort_num:
        newpaths.append(video_paths[num][0])
    return newpaths


def read_txt(path):
    names = []
    with open(path, 'r', encoding='utf8') as fls:
        datas = fls.readlines()
        for data in datas:
            if data.strip() != '':
                names.append(data.strip())
    return names


def main():
    path = input("请输入视频所在目录\n")
    # path = r'D:\work\path'
    key = input('请输入视频格式(例如mp4)\n')
    # key = 'mp4'
    txtpath = input('请输入存放新名字的txt路径\n')
    # txtpath = r'D:\work\path\temp.txt'
    video_paths = search_video(path, key)
    file_names = read_txt(txtpath)
    for i, video_path in enumerate(video_paths):
        os.rename(video_path, os.path.join(os.path.split(video_path)[0], file_names[i] + '.' + key))


if __name__ == "__main__":
    main()
    input("重命名完成,按任意键退出")
